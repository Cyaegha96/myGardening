package com.ggirick.gardening_back.dto.potList;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatDTO {
    @Schema(description = "시퀀스번호")
    int id;
    @Schema(description = "채팅방 번호")
    int chatRoomId;
    @Schema(description = "보낸이")
    String senderUid;
    @Schema(description = "내용")
    String content;
    @Schema(description = "읽음 여부")
    String isRead;
    @Schema(description = "전송 일자")
    Timestamp sentAt;
}
