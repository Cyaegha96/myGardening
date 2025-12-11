package com.ggirick.gardening_back.dto.chatbot;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatbotMessageDTO {
    @Schema(description = "메시지 고유 ID", example = "11")
    private int id;

    @Schema(description = "상담 세션 ID", example = "10")
    private int sessionId;

    @Schema(description = "메시지 발신자 (user 또는 bot)", example = "user")
    private String sender;

    @Schema(description = "메시지 내용", example = "안녕하세요 상담하고 싶어요")
    private String content;

    @Schema(description = "원본 파일명", example = "노랑이.png")
    private String oriName;

    @Schema(description = "서버저장용 파일명", example = "노랑이2e2e2e.png")
    private String sysName;

    @Schema(description = "스토리지 public url", example = "https://...노랑이2e2e2e.png")
    private String url;

    @Schema(description = "메시지 생성 시각 (TIMESTAMP)", example = "2025-12-09 10:30:25")
    private Timestamp createdAt;
}
