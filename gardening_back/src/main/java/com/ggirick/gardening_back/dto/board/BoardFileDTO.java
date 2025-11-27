package com.ggirick.gardening_back.dto.board;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardFileDTO {
    @Schema(description = "파일 고유 번호", example = "11")
    private int id;

    @Schema(description = "글 번호", example = "1")
    private int boardId;

    @Schema(description = "원본 파일명", example = "myPlants.jpg")
    private String oriName;

    @Schema(description = "시스템에 저장된 파일명", example = "myPlants_abcabc123.jpg")
    private String sysName;

    @Schema(description = "파일 URL", example = "https://cdn.ggirick.com/abc.jpg")
    private String url;

    @Schema(description = "파일 등록일자", example = "yyyy-mm-dd")
    private Timestamp createdAt;
}
