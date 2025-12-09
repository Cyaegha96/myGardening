package com.ggirick.gardening_back.controllers.chatbot;

import com.ggirick.gardening_back.services.chatbot.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/test/gemini")
public class GeminiTestController {

    private final GeminiService geminiService;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<String> test(
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestPart(value = "message", required = false) String message
    ) {

        String res = geminiService.getChatResponseWithImage(file,
                message != null ? message : "Hello Gemini!");

        return ResponseEntity.ok(res);
    }
}

