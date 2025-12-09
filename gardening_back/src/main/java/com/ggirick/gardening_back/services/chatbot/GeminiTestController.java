package com.ggirick.gardening_back.services.chatbot;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/test/gemini")
public class GeminiTestController {

    private final GeminiService geminiService;

    @GetMapping
    public ResponseEntity<String> test() {
        String res = geminiService.sendTextTest("Hello Gemini!");
        return ResponseEntity.ok(res);
    }
}

