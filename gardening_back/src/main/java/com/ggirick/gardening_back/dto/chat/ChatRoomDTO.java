package com.ggirick.gardening_back.dto.chat;

import com.ggirick.gardening_back.dto.potList.PotListDetailDTO;
import com.ggirick.gardening_back.enums.chat.ChatRoomStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoomDTO {
    @Schema(description = "시퀀스번호")
    int id;
    @Schema(description = "채팅방 분양글 id")
    int potListingId;
    @Schema(description = "채팅방 상태(채팅방 나가기 등)")
    ChatRoomStatus status;
    @Schema(description = "채팅방 생성일")
    Timestamp createdAt;
    @Schema(description = "마지막 채팅")
    String lastChat;
    @Schema(description = "마지막 채팅 일자")
    Timestamp lastMessageTime;
    @Schema(description = "분양글 정보")
    PotListDetailDTO potInfo;
    @Schema(description = "안 읽은 채팅 수")
    int unreadChatCount;
}
