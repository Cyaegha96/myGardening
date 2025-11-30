package com.ggirick.gardening_back.dto.tag;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "이미지 기반 태그 자동 추천 응답 DTO")
public class TagRecommendResponseDTO {

    @Schema(description = "태그 ID", example = "100")
    private int tagId;

    @Schema(description = "태그명", example = "실내식물")
    private String tagName;

    @Schema(description = "상위 태그 ID", example = "null")
    private Integer parentTagId;

    @Schema(description = "태그 설명", example = "실내 환경에서 잘 자라는 식물")
    private String description;
}
