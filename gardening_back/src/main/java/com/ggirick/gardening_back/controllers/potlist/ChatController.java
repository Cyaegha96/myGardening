package com.ggirick.gardening_back.controllers.potlist;

import com.ggirick.gardening_back.dto.potlist.ChatDTO;
import com.ggirick.gardening_back.services.potlist.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/chat")
public class ChatController {
    private final ChatService chatService;

    @PostMapping("/send")
    public ResponseEntity<Void> sendMessage(@RequestBody ChatDTO chat) {
        chatService.sendMessage(chat);
        return ResponseEntity.ok().build();
    }
}
