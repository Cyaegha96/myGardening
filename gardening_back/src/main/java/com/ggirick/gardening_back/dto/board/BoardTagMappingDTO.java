package com.ggirick.gardening_back.dto.board;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "게시글-태그 매핑 DTO")
public class BoardTagMappingDTO {

    @Schema(description = "게시글 ID", example = "15")
    private int boardId;

    @Schema(description = "태그 ID", example = "200")
    private int tagId;
}
