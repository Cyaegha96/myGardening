package com.ggirick.gardening_back.dto.myPlant;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MyPlantDTO {
    @Schema(description = "식물 고유 번호", example = "1")
    private int userPlantId;

    @Schema(description = "소유자 UID", example = "eun")
    private String userUid;

    @Schema(description = "식물 별명", example = "노랑이")
    private String nickname;

    @Schema(description = "식물 학명", example = "Sansevieria stuckyi")
    private String plantScientificName;

    @Schema(description = "식물 메모", example = "생일날 만난 노랑이")
    private String memo;

    @Schema(description = "식물 등록일 또는 구매일", example = "2025-12-01")
    private String acquiredAt;

    @Schema(description = "식물 상태", example = "healthy/sick/dead")
    private String status;

    @Schema(description = "등록일자", example = "yyyy-MM-dd HH:mm:ss")
    private Timestamp createdAt;
    @Schema(description = "수정일자", example = "yyyy-MM-dd HH:mm:ss")
    private Timestamp updatedAt;
}
