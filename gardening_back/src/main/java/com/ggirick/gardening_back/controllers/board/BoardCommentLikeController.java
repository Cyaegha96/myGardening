package com.ggirick.gardening_back.controllers.board;

import com.ggirick.gardening_back.dto.auth.UserTokenDTO;
import com.ggirick.gardening_back.services.board.BoardCommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/board/comment/like")
@RestController
@RequiredArgsConstructor
public class BoardCommentLikeController {

    private final BoardCommentService boardCommentService;

    // 댓글 좋아요 토글 (추가/삭제)
    @Operation(
            summary = "댓글 좋아요 토글",
            description = "해당 댓글에 좋아요를 추가하거나 취소한다. "
                    + "이미 눌렀다면 좋아요 취소, 아니면 좋아요 추가."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "좋아요 상태 변경됨")
    })
    @PostMapping("/{commentId}")
    public ResponseEntity<String> toggleLike(
            @PathVariable int commentId,
            @AuthenticationPrincipal UserTokenDTO userInfo
    ) {
        boolean liked = boardCommentService.toggleLike(commentId, userInfo.getUid());

        return ResponseEntity.ok(liked ? "좋아요 추가" : "좋아요 취소");
    }
}
