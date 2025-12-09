package com.ggirick.gardening_back.dto.potList;

import com.ggirick.gardening_back.enums.potList.ChatroomStatus;
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
    @Schema(description = "채팅방 상태(채팅방 나가기 등)")
    ChatroomStatus status;
    @Schema(description = "채팅방 생성일")
    Timestamp createdAt;
}
