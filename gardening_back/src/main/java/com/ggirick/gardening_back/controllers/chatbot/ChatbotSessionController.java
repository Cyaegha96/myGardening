package com.ggirick.gardening_back.controllers.chatbot;

import com.ggirick.gardening_back.dto.auth.UserTokenDTO;
import com.ggirick.gardening_back.dto.chatbot.ChatbotSessionDTO;
import com.ggirick.gardening_back.services.chatbot.ChatbotSessionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/chatbot/session")
public class ChatbotSessionController {

    private final ChatbotSessionService chatbotSessionService;

    // 상담 시작
    @Operation(
            summary = "상담 세션 생성",
            description = "사용자 UID를 기반으로 상담 세션을 생성합니다. 이미 ACTIVE 상태라면 기존 세션을 반환합니다."
    )
    @ApiResponse(responseCode = "200", description = "세션 생성 또는 기존 세션 응답")
    @PostMapping
    public ResponseEntity<ChatbotSessionDTO> createSession(
            @AuthenticationPrincipal UserTokenDTO userInfo
    ) {
        ChatbotSessionDTO session = chatbotSessionService.createSession(userInfo.getUid());
        return ResponseEntity.ok(session);
    }

    // 상담 종료
    @Operation(
            summary = "상담 종료",
            description = "현재 진행 중인 상담 세션을 종료합니다."
    )
    @ApiResponse(responseCode = "200", description = "종료 성공")
    @PatchMapping("/{sessionId}/end")
    public ResponseEntity<Void> endSession(
            @AuthenticationPrincipal UserTokenDTO userInfo,
            @PathVariable int sessionId) {
        chatbotSessionService.endSession(sessionId, userInfo.getUid());
        return ResponseEntity.ok().build();
    }
}
