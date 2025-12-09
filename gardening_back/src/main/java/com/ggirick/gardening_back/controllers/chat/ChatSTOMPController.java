package com.ggirick.gardening_back.controllers.chat;

import com.ggirick.gardening_back.dto.auth.UserTokenDTO;
import com.ggirick.gardening_back.dto.chat.ChatDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

    @MessageMapping("/chat.send")
    @SendTo("/topic/messages")
    public void sendMessage(@Payload ChatDTO chat,
                            Principal principal) {
        Authentication auth = (Authentication) principal;
        UserTokenDTO userInfo = (UserTokenDTO) auth.getPrincipal();

        if (userInfo != null) {
            chat.setSenderUid(userInfo.getUid());

            messagingTemplate.convertAndSend(
                    "/topic/chat/" + chat.getChatRoomId(),
                    chat
            );
        }
    }
}
