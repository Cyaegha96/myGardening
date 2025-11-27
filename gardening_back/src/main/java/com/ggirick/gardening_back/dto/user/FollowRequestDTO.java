package com.ggirick.gardening_back.dto.user;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FollowRequestDTO {
    @Schema(description = "팔로우할 대상 사용자 UID", example = "user123")
    private String followingUid;
}
