package com.ggirick.gardening_back.dto.board;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.sql.Timestamp;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(
        name = "BoardCommentResponseDTO",
        requiredProperties = { "id", "boardId", "contents",
                "writerUid", "writerNickname", "createdAt",
                "updatedAt", "createdAtFormatted", "status" }
)
public class BoardCommentResponseDTO {
    @Schema(description = "글 번호", example = "1")
    private int boardId;
    @Schema(description = "댓글 고유 번호", example = "5")
    private int id;
    @Schema(description = "댓글 내용", example = "잘 키우셨네요!")
    private String contents;

    // 작성자 정보
    @Schema(description = "작성자 ID", example = "meowmeow")
    private String writerUid;
    @Schema(description = "작성자 닉네임", example = "야옹")
    private String writerNickname;
    @Schema(description = "작성자 프로필이미지", example = "https://.../meow.jpg")
    private String writerProfileUrl;

    // 대댓글 구조
    @Schema(description = "대댓글인 경우 참조하는 부모 댓글 번호", example = "1")
    private int refCommentId;
    @Schema(description = "자식 댓글 묶음", example = "댓글5의 댓글6, 댓글5의 댓글7")
    private List<BoardCommentResponseDTO> children;

    // UI 표시용
    @Schema(description = "댓글 작성 시간 포맷용", example = "3시간 전")
    private String createdAtFormatted;
    @Schema(description = "댓글 작성자 여부", example = "true/false")
    private boolean isMine; // 로그인 사용자 == 작성자
    @Schema(description = "부모 댓글 작성자 닉네임", example = "@야옹")
    private String parentWriterNickname;

    @Schema(description = "댓글 작성일자", example = "yyyy-mm-dd")
    private Timestamp createdAt;
    @Schema(description = "댓글 수정일자", example = "yyyy-mm-dd")
    private Timestamp updatedAt;

    // 👍 좋아요 관련
    @Schema(description = "댓글 좋아요 수", example = "25")
    private int likeCount;   // 좋아요 개수
    @Schema(description = "내가 좋아요 눌렀는지 여부", example = "true/false")
    private boolean liked;   // 내가 좋아요 눌렀는지 여부

    // 상태
    @Schema(description = "댓글 상태", example = "ACTIVE/DELETE/BLOCKED")
    private String status;       // UI에서 판단용
}
