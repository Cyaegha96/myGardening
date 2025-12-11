package com.ggirick.gardening_back.controllers.chatbot;

import com.ggirick.gardening_back.dto.auth.UserTokenDTO;
import com.ggirick.gardening_back.dto.chatbot.ChatbotMessageDTO;
import com.ggirick.gardening_back.dto.chatbot.ChatbotRequestDTO;
import com.ggirick.gardening_back.dto.chatbot.ChatbotResponseDTO;
import com.ggirick.gardening_back.services.chatbot.ChatbotService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/chatbot")
public class ChatbotController {

    private final ChatbotService chatbotService;

    // 1) 상담 세션 시작
    @Operation(
            summary = "상담 세션 생성",
            description = "사용자 UID를 기반으로 상담 세션을 생성합니다. 이미 active 상태라면 기존 세션을 반환합니다."
    )
    @ApiResponse(responseCode = "200", description = "세션 생성 또는 기존 세션 응답")
    @PostMapping("/session/start")
    public ResponseEntity<ChatbotResponseDTO> startSession(
            @AuthenticationPrincipal UserTokenDTO userInfo
    ) {
        ChatbotResponseDTO response = chatbotService.startSession(userInfo.getUid());
        return ResponseEntity.ok(response);
    }

    // 2) 상담 종료
    @Operation(
            summary = "상담 종료",
            description = "현재 진행 중인 상담 세션을 종료합니다."
    )
    @ApiResponse(responseCode = "200", description = "종료 성공")
    @PatchMapping("/session/{sessionId}/end")
    public ResponseEntity<Void> endSession(
            @AuthenticationPrincipal UserTokenDTO userInfo,
            @PathVariable int sessionId
    ) {
        chatbotService.endSession(sessionId, userInfo.getUid());
        return ResponseEntity.ok().build();
    }

    // 3) 메시지 전송 + 챗봇 응답 반환
    @Operation(
            summary = "사용자 메시지 전송",
            description = "사용자가 챗봇에게 메시지(텍스트/이미지)를 보내면, Gemini API 응답을 반환합니다."
    )
    @ApiResponse(responseCode = "200",
            description = "챗봇 응답 반환",
            content = @Content(schema = @Schema(implementation = ChatbotResponseDTO.class)))
    @PostMapping(value = "/session/{sessionId}/message", consumes = "multipart/form-data")
    public ResponseEntity<ChatbotResponseDTO> sendMessage(
            @PathVariable int sessionId,
            @AuthenticationPrincipal UserTokenDTO loginUser,
            @RequestPart(value = "message", required = false) ChatbotRequestDTO dto,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) throws Exception {

        ChatbotResponseDTO response = chatbotService.sendMessage(
                sessionId,
                loginUser.getUid(),
                dto,
                file
        );

        return ResponseEntity.ok(response);
    }

    // 4) 세션 메시지 조회 (무한 스크롤)
    @Operation(
            summary = "세션 메시지 조회 (페이징)",
            description = "offset, limit 기반 최신 메시지 페이징 조회, 무한 스크롤 지원"
    )
    @ApiResponse(
            responseCode = "200",
            description = "조회된 메시지 목록 반환",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = ChatbotMessageDTO.class)))
    )
    @GetMapping("/session/{sessionId}/messages")
    public ResponseEntity<List<ChatbotMessageDTO>> getMessagesForUI(
            @PathVariable int sessionId,
            @RequestParam(defaultValue = "0") int offset,
            @RequestParam(defaultValue = "20") int limit,
            @AuthenticationPrincipal UserTokenDTO loginUser
    ) {
        List<ChatbotMessageDTO> messages =
                chatbotService.getMessagesForUI(sessionId, loginUser.getUid(), offset, limit);

        return ResponseEntity.ok(messages);
    }
}
