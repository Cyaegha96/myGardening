package com.ggirick.gardening_back.dto.chatbot;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatbotRequestDTO {

    @Schema(description = "사용자가 보낸 메시지 내용", example = "안녕하세요 질문 있어요.")
    private String content;
}
