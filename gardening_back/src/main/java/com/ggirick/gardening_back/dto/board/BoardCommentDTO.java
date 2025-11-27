package com.ggirick.gardening_back.dto.board;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardCommentDTO {
    @Schema(description = "댓글 고유 번호", example = "5")
    private int id;

    @Schema(description = "작성자 ID", example = "eun")
    private String writerUid;

    @Schema(description = "댓글 내용", example = "잘 키우셨네요!")
    private String contents;

    @Schema(description = "대댓글인 경우 참조하는 부모 댓글 번호", example = "1")
    private int refCommentId;

    @Schema(description = "글 번호", example = "10")
    private int boardId;

    @Schema(description = "댓글 상태", example = "ACTIVE/DELETE")
    private String status;

    @Schema(description = "댓글 작성일자", example = "yyyy-mm-dd")
    private Timestamp createdAt;

    @Schema(description = "댓글 수정일자", example = "yyyy-mm-dd")
    private Timestamp updatedAt;
}
