package com.ggirick.gardening_back.dto.potList;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatroomParticipantsDTO {
    @Schema(description = "시퀀스번호")
    int id;
    @Schema(description = "채팅방 번호")
    int chatRoomId;
    @Schema(description = "참여자 id")
    String userUid;
    @Schema(description = "채팅방 참여 일자")
    Timestamp joinedAt;
}
