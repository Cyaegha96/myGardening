package com.ggirick.gardening_back.controllers.board;

import com.ggirick.gardening_back.dto.auth.UserTokenDTO;
import com.ggirick.gardening_back.dto.board.BoardResponseDTO;
import com.ggirick.gardening_back.services.board.BoardLikeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/board/like")
public class BoardLikeController {

    private final BoardLikeService boardLikeService;

    // 좋아요 여부 조회
    @Operation(summary = "좋아요 여부 확인", description = "로그인 사용자가 특정 게시글에 좋아요를 눌렀는지 확인한다.")
    @ApiResponse(responseCode = "200", description = "확인 성공 (true / false)")
    @GetMapping("/{boardId}")
    public ResponseEntity<Boolean> isLiked(
            @PathVariable int boardId,
            @AuthenticationPrincipal UserTokenDTO userInfo
    ) {
        boolean liked = boardLikeService.isLiked(boardId, userInfo.getUid());
        return ResponseEntity.ok(liked);
    }

    // 좋아요 추가
    @Operation(summary = "좋아요 추가", description = "게시글에 좋아요를 추가한다.")
    @ApiResponse(responseCode = "200", description = "좋아요 성공")
    @PostMapping("/{boardId}")
    public ResponseEntity<Void> insertLike(
            @PathVariable int boardId,
            @AuthenticationPrincipal UserTokenDTO userInfo
    ) {
        boardLikeService.insertLike(boardId, userInfo.getUid());
        return ResponseEntity.ok().build();
    }

    // 좋아요 취소
    @Operation(summary = "좋아요 취소", description = "게시글의 좋아요를 취소한다.")
    @ApiResponse(responseCode = "200", description = "취소 성공")
    @DeleteMapping("/{boardId}")
    public ResponseEntity<Void> deleteLike(
            @PathVariable int boardId,
            @AuthenticationPrincipal UserTokenDTO userInfo
    ) {
        boardLikeService.deleteLike(boardId, userInfo.getUid());
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "내 좋아요 목록 조회")
    @GetMapping
    public ResponseEntity<List<BoardResponseDTO>> getMyLikes(
            @AuthenticationPrincipal UserTokenDTO user
    ) {
        // Mapper에 getLikedList 구현 필요
        return ResponseEntity.ok(
                boardLikeService.getLikedList(user.getUid())
        );
    }
}
