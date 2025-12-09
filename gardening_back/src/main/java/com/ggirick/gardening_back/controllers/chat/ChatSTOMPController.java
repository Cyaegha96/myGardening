package com.ggirick.gardening_back.controllers.chat;

import com.ggirick.gardening_back.dto.auth.UserTokenDTO;
import com.ggirick.gardening_back.dto.chat.ChatDTO;
import com.ggirick.gardening_back.services.chat.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Slf4j
@Controller
@RequiredArgsConstructor
public class ChatSTOMPController {
    private final SimpMessagingTemplate messagingTemplate;
    private final RabbitTemplate rabbitTemplate;
    private final ChatService chatService;

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

            rabbitTemplate.convertAndSend("dlx","chat.delay.key" , chat);
        }
    }

    @MessageMapping("/chat.ack")
    public void ackMessage(@Payload ChatDTO ack,
                           Principal principal) {
        Authentication auth = (Authentication) principal;
        UserTokenDTO userInfo = (UserTokenDTO) auth.getPrincipal();

        if(userInfo != null) {
            chatService.updateChatIsReadById(ack.getId());
            messagingTemplate.convertAndSend(
                    "/topic/chat/ack/" + ack.getChatRoomId(),
                    ack
            );
        }
    }
}
