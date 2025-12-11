package com.ggirick.gardening_back.dto.chatbot;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatbotResponseDTO {

    @Schema(description = "세션 ID", example = "10")
    private int sessionId;

    @Schema(description = "사용자 || 챗봇", example = "user || bot")
    private String sender;

    @Schema(description = "봇 응답 메시지")
    private String content;

    @Schema(description = "이미지 url")
    private String url;
}
