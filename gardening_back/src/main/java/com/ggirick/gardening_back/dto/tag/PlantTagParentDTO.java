package com.ggirick.gardening_back.dto.tag;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "식물 태그 부모 DTO")
public class PlantTagParentDTO {
    @Schema(description = "태그 고유 ID", example = "1")
    private int tagId;

    @Schema(description = "태그 분류", example = "PLANT_TYPE")
    private String tagName;

    @Schema(description = "태그 설명", example = "식물 종류 기반 태그")
    private String description;

    @Schema(description = "생성 시간", example = "2025-11-23 12:33:20")
    private String createdAt;

    @Schema(description = "수정 시간", example = "2025-11-23 15:20:10")
    private String updatedAt;
}
