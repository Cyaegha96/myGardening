package com.ggirick.gardening_back.dto.potlist;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatroomDTO {
    @Schema(description = "시퀀스번호")
    int id;
    @Schema(description = "채팅방 분양글 id")
    int potListingId;
    @Schema(description = "채팅방 생성일")
    Timestamp createdAt;
}
