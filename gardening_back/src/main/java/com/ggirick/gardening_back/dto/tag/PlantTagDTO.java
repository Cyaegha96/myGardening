package com.ggirick.gardening_back.dto.tag;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "식물 태그 정보 DTO")
public class PlantTagDTO {

    @Schema(description = "태그 고유 ID", example = "100")
    private int tagId;

    @Schema(description = "태그명", example = "실내식물")
    private String tagName;

    @Schema(description = "상위 태그 ID (없으면 null)", example = "null")
    private Integer parentTagId;

    @Schema(description = "태그 설명", example = "실내에서 키우기 좋은 식물")
    private String description;

    @Schema(description = "생성 시간", example = "2025-11-23 12:33:20")
    private String createdAt;

    @Schema(description = "수정 시간", example = "2025-11-23 15:20:10")
    private String updatedAt;
}
