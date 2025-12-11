package com.ggirick.gardening_back.dto.chatbot;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatbotSessionDTO {

    @Schema(description = "세션 번호", example = "10")
    private int id;

    @Schema(description = "사용자 UID", example = "user_123")
    private String userUid;

    @Schema(description = "챗봇 타입", example = "plant_bot")
    private String botType;

    @Schema(description = "세션 상태", example = "active")
    private String status;

    @Schema(description = "상담 시작 시간")
    private Timestamp startedAt;

    @Schema(description = "상담 종료 시간")
    private Timestamp endedAt;
}
