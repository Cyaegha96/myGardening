package com.ggirick.gardening_back.consumers.chat;

import com.ggirick.gardening_back.dto.chat.ChatDTO;
import com.ggirick.gardening_back.dto.chat.ChatRoomDTO;
import com.ggirick.gardening_back.dto.notification.NotificationDTO;
import com.ggirick.gardening_back.services.auth.UserService;
import com.ggirick.gardening_back.services.chat.ChatRoomParticipantsService;
import com.ggirick.gardening_back.services.chat.ChatRoomService;
import com.ggirick.gardening_back.services.chat.ChatService;
import com.ggirick.gardening_back.services.notification.NotificationService;
import com.rabbitmq.client.Channel;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ChatRabbitConsumer {
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;
    private final ChatRoomService chatRoomService;
    private final NotificationService notificationService;
    private final UserService userService;
    private final ChatRoomParticipantsService chatRoomParticipantsService;

    @RabbitListener(queues = "chat.queue", ackMode = "MANUAL")
    public void receiveChatMessage(Message message, Channel channel) throws IOException {
        ChatDTO chat = (ChatDTO) new Jackson2JsonMessageConverter().fromMessage(message);

        MessageProperties props = message.getMessageProperties();
        long deliveryTag = props.getDeliveryTag();

        // x-death 헤더에서 재시도 횟수 확인
        Map<String, Object> headers = message.getMessageProperties().getHeaders();
        int retryCount = 0;
        if (headers.containsKey("x-death")) {
            List<Map<String, Object>> xDeath = (List<Map<String, Object>>) headers.get("x-death");
            if (!xDeath.isEmpty()) {
                retryCount = ((Long) xDeath.get(0).get("count")).intValue();
            }
        }

        if (retryCount >= 3) {
//            List<ChatRoomDTO> chatRoomList = chatRoomService.getChatRoomListByUserUid(chat.getSenderUid());
//            ChatRoomDTO targetRoom = chatRoomList.stream()
//                    .filter(r -> r.getPotListingId() == chat.getChatRoomId())
//                    .findFirst()
//                    .orElse(null);
//            NotificationDTO notification = NotificationDTO.builder()
//                    .type("chatroom")
//                    .userUid(chatRoomParticipantsService.getParticipantByPotIdAndNotUserUid(targetRoom.getId(), chat.getSenderUid()))
//                    .message(userService.getUserInfo(chat.getSenderUid()).getNickname() + "님이 " + targetRoom.getPotInfo().getTitle() + "에 메시지를 남겼습니다.")
//                    .referenceId(chat.getChatRoomId())
//                    .build();
//            notificationService.insertNotification(notification);
//            messagingTemplate.convertAndSend(
//                    "/topic/notification/" + chatRoomParticipantsService.getParticipantByPotIdAndNotUserUid(targetRoom.getId(), chat.getSenderUid()),
//                    notification
//            );

            System.out.println("메시지 폐기: " + chat);
            channel.basicAck(deliveryTag, false);
            return; // 3회 이상이면 폐기
        }

        ChatDTO chatCurrentState = chatService.getChatById(chat.getId());
        if (chatCurrentState.getIsRead().equals("Y")) {
            channel.basicAck(deliveryTag, false);
            return;
        }

        messagingTemplate.convertAndSend(
                "/topic/chat/" + chat.getChatRoomId(),
                chat
        );
        channel.basicNack(deliveryTag, false, false);
    }
}
