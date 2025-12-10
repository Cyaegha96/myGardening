package com.ggirick.gardening_back.dto.notification;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDTO {
    @Schema(description = "시퀀스번호")
    int id;
    @Schema(description = "알림대상")
    String userUid;
    @Schema(description = "타입(게시글, 채팅 등")
    String type;
    @Schema(description = "개별 ID")
    int referenceId;
    @Schema(description = "내용")
    String message;
    @Schema(description = "읽음 여부")
    String isRead;
    @Schema(description = "알림일")
    String createdAt;
}
