package com.ggirick.gardening_back.controllers.board;

import com.ggirick.gardening_back.dto.auth.UserTokenDTO;
import com.ggirick.gardening_back.dto.board.BoardCommentDTO;
import com.ggirick.gardening_back.dto.board.BoardCommentResponseDTO;
import com.ggirick.gardening_back.services.board.BoardCommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/board/{boardId}/comment")
@RestController
@RequiredArgsConstructor
public class BoardCommentController {

    private final BoardCommentService boardCommentService;

    // 댓글 목록 조회
    @Operation(
            summary = "댓글 목록 조회 (트리 구조)",
            description = "해당 게시글(boardId)의 전체 댓글을 트리 구조로 조회한다. "
                    + "BEST(좋아요 많은 순) → 최신순으로 정렬되며, "
                    + "대댓글은 트리 구조로 반환된다. "
                    + "삭제되거나 규제된 댓글은 정책에 따라 숨기거나 대체 문구로 반환된다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "댓글 목록 조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = BoardCommentResponseDTO.class))
                    )
            )
    })
    @GetMapping
    public ResponseEntity<List<BoardCommentResponseDTO>> getComments(
            @PathVariable int boardId,
            @AuthenticationPrincipal UserTokenDTO userInfo
    ) {
        // 로그인 여부에 따라
        String loginUid = (userInfo != null) ? userInfo.getUid() : null;

        List<BoardCommentResponseDTO> list =
                boardCommentService.getCommentsWithTree(boardId, loginUid);

        return ResponseEntity.ok(list);
    }

    // 댓글 등록
    @Operation(
            summary = "댓글 등록",
            description = "해당 게시글(boardId)에 댓글을 등록한다. "
                    + "로그인한 사용자의 UID를 writerUid로 설정한다. "
                    + "refCommentId가 0 또는 -1이면 일반 댓글, "
                    + "그 외에는 대댓글로 처리된다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "댓글 등록 완료")
    })
    @PostMapping
    public ResponseEntity<Void> insertComment(
            @PathVariable int boardId,
            @RequestBody BoardCommentDTO dto,
            @AuthenticationPrincipal UserTokenDTO user
    ) {
        dto.setBoardId(boardId);
        dto.setWriterUid(user.getUid());

        boardCommentService.insertComment(dto);

        return ResponseEntity.ok().build();
    }

    // 댓글 수정
    @Operation(
            summary = "댓글 수정",
            description = "기존 댓글 내용을 수정한다. "
                    + "작성자 본인만 수정 가능하며, "
                    + "작성자가 아닌 경우 403 Forbidden."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "댓글 수정 완료"),
            @ApiResponse(responseCode = "403", description = "수정 권한 없음")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateComment(
            @PathVariable int boardId,
            @PathVariable int id,
            @RequestBody BoardCommentDTO dto,
            @AuthenticationPrincipal UserTokenDTO user
    ) {
        dto.setId(id);
        dto.setWriterUid(user.getUid());

        int result = boardCommentService.updateComment(dto);

        if (result == 0) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok().build();
    }

    // 댓글 삭제 (Soft Delete)
    @Operation(
            summary = "댓글 삭제 (Soft Delete)",
            description = "댓글을 삭제 상태로 변경한다. "
                    + "부모 댓글이 삭제되었고 자식이 있으면 '삭제된 댓글입니다'를 표시. "
                    + "자식이 없으면 UI에서 숨겨진다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "댓글 삭제 완료")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable int boardId,
            @PathVariable int id
    ) {
        boardCommentService.deleteComment(id);
        return ResponseEntity.ok().build();
    }

    // 댓글 규제 (관리자용 BLOCKED)
    @Operation(
            summary = "댓글 규제 (BLOCKED)",
            description = "관리자가 댓글을 규제 상태(BLOCKED)로 변경한다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "댓글 규제 완료")
    })
    @PatchMapping("/block/{id}")
    public ResponseEntity<Void> blockComment(
            @PathVariable int boardId,
            @PathVariable int id
    ) {
        boardCommentService.blockComment(id);
        return ResponseEntity.ok().build();
    }
}
