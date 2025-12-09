package com.ggirick.gardening_back.controllers.chatbot;

import com.ggirick.gardening_back.dto.auth.UserTokenDTO;
import com.ggirick.gardening_back.dto.chatbot.ChatbotRequestDTO;
import com.ggirick.gardening_back.services.chatbot.ChatbotMessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/chatbot/message")
public class ChatbotMessageController {

    private final ChatbotMessageService chatbotMessageService;

    // 사용자 메시지 저장
//    @Operation(
//            summary = "사용자 메시지 저장",
//            description = "해당 세션 ID로 사용자 메시지를 저장합니다."
//    )
//    @ApiResponse(responseCode = "200", description = "저장 결과 true/false 반환")
//    @PostMapping("/{sessionId}")
//    public ResponseEntity<Boolean> saveUserMessage(
//            @AuthenticationPrincipal UserTokenDTO userInfo,
//            @PathVariable int sessionId,
//            @RequestBody ChatbotRequestDTO request
//    ) {
//        boolean result = chatbotMessageService.saveUserMessage(sessionId, request.getContent());
//        return ResponseEntity.ok(result);
//    }
}
