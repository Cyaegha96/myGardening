package com.ggirick.gardening_back.dto.board;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "게시글 태그 정보 DTO")
public class BoardTagDTO {

    @Schema(description = "게시글 태그 ID", example = "1")
    private int id;

    @Schema(description = "게시글 태그명", example = "인테리어식물")
    private String name;
}
