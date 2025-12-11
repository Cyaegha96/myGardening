package com.ggirick.gardening_back.controllers.chat;

import com.ggirick.gardening_back.dto.auth.UserTokenDTO;
import com.ggirick.gardening_back.dto.chat.ChatDTO;
import com.ggirick.gardening_back.dto.chat.ChatRoomDTO;
import com.ggirick.gardening_back.dto.notification.NotificationDTO;
import com.ggirick.gardening_back.services.auth.UserService;
import com.ggirick.gardening_back.services.chat.ChatRoomParticipantsService;
import com.ggirick.gardening_back.services.chat.ChatRoomService;
import com.ggirick.gardening_back.services.chat.ChatService;
import com.ggirick.gardening_back.services.notification.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.List;

@Slf4j
@Controller
@RequiredArgsConstructor
public class ChatSTOMPController {
    private final SimpMessagingTemplate messagingTemplate;
    private final RabbitTemplate rabbitTemplate;
    private final ChatService chatService;
    private final ChatRoomService chatRoomService;
    private final NotificationService notificationService;
    private final UserService userService;
    private final ChatRoomParticipantsService chatRoomParticipantsService;


    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatDTO chat,
                            Principal principal) {
        Authentication auth = (Authentication) principal;
        UserTokenDTO userInfo = (UserTokenDTO) auth.getPrincipal();

        if (userInfo != null) {
            chat.setSenderUid(userInfo.getUid());

            long chatId = chatService.insertChat(chat);
            chat.setId(chatId);

            messagingTemplate.convertAndSend(
                    "/topic/chat/" + chat.getChatRoomId(),
                    chat
            );

            List<ChatRoomDTO> chatRoomList = chatRoomService.getChatRoomListByUserUid(chat.getSenderUid());
            ChatRoomDTO targetRoom = chatRoomList.stream()
                    .filter(r -> r.getPotListingId() == chat.getChatRoomId())
                    .findFirst()
                    .orElse(null);
            NotificationDTO notification = NotificationDTO.builder()
                    .type("chatroom")
                    .userUid(chatRoomParticipantsService.getParticipantByPotIdAndNotUserUid(targetRoom.getId(), chat.getSenderUid()))
                    .message(userService.getUserInfo(chat.getSenderUid()).getNickname() + "님이 " + targetRoom.getPotInfo().getTitle() + "에 메시지를 남겼습니다.")
                    .referenceId(chat.getChatRoomId())
                    .build();
            notificationService.insertNotification(notification);
            messagingTemplate.convertAndSend(
                    "/topic/notification/" + chatRoomParticipantsService.getParticipantByPotIdAndNotUserUid(targetRoom.getId(), chat.getSenderUid()),
                    notification
            );

            rabbitTemplate.convertAndSend("dlx", "chat.delay.key", chat);
        }
    }

    @MessageMapping("/chat.ack")
    public void ackMessage(@Payload ChatDTO ack,
                           Principal principal) {
        Authentication auth = (Authentication) principal;
        UserTokenDTO userInfo = (UserTokenDTO) auth.getPrincipal();

        if (userInfo != null) {
            chatService.updateChatIsReadById(ack.getId());
            messagingTemplate.convertAndSend(
                    "/topic/chat/ack/" + ack.getChatRoomId(),
                    ack
            );
        }
    }
}
