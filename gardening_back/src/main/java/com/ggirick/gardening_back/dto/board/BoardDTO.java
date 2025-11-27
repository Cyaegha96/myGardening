package com.ggirick.gardening_back.dto.board;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardDTO {
    @Schema(description = "글 번호", example = "1")
    private int id;

    @Schema(description = "글 제목", example = "몬스테라 질문있습니다.")
    private String title;

    @Schema(description = "작성자 아이디", example = "eun")
    private String writerUid;

    @Schema(description = "글 내용", example = "몬스테라 물 자주 줘야 되나요?")
    private String contents;

    @Schema(description = "공지여부", example = "Y/N")
    private String isNotification;

    @Schema(description = "글 상태", example = "Active/Delete")
    private String status;

    @Schema(description = "조회수", example = "0")
    private int viewCount;

    @Schema(description = "작성일자", example = "yyyy-MM-dd HH:mm:ss")
    private Timestamp createdAt;
    @Schema(description = "수정일자", example = "yyyy-MM-dd HH:mm:ss")
    private Timestamp updatedAt;
}
