package com.ggirick.gardening_back.controllers.potList;

import com.ggirick.gardening_back.dto.auth.UserTokenDTO;
import com.ggirick.gardening_back.dto.potList.ChatDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Slf4j
@Controller
@RequiredArgsConstructor
public class ChatController {

    @MessageMapping("/chat.send")  // -> /app/chat.send
    @SendTo("/topic/messages")     // 모든 구독자에게 broadcast
    public ChatDTO sendMessage(@Payload ChatDTO msg,
                               Principal principal) {
        Authentication auth = (Authentication) principal;
        UserTokenDTO userInfo = (UserTokenDTO) auth.getPrincipal();

        ChatController.log.info("Received from client: {}유저 UUID: {}", msg.getContent(), userInfo.getUid());
        return msg;  // 그대로 브로드캐스트
    }
}
