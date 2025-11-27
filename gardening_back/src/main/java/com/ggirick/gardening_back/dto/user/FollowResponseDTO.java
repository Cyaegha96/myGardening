package com.ggirick.gardening_back.dto.user;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FollowResponseDTO {
    @Schema(description = "팔로워 UID", example = "userA")
    private String followerUid;

    @Schema(description = "팔로잉 UID", example = "userB")
    private String followingUid;

    @Schema(description = "활성 여부", example = "Y")
    private String isActive;

    @Schema(description = "팔로우한 날짜", example = "2025-01-01 10:00:00")
    private String createdAt;
}
