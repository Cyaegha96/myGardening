package com.ggirick.gardening_back.controllers.board;

import com.ggirick.gardening_back.dto.auth.UserTokenDTO;
import com.ggirick.gardening_back.dto.board.BoardResponseDTO;
import com.ggirick.gardening_back.services.board.BoardBookmarkService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/board/bookmark")
public class BoardBookmarkController {

    private final BoardBookmarkService boardBookmarkService;

    @Operation(summary = "북마크 여부 확인", description = "로그인 사용자가 해당 게시글을 북마크했는지 확인한다.")
    @ApiResponse(responseCode = "200", description = "확인 성공")
    @GetMapping("/{boardId}")
    public ResponseEntity<Boolean> isBookmarked(
            @PathVariable int boardId,
            @AuthenticationPrincipal UserTokenDTO userInfo
    ) {
        boolean bookmarked = boardBookmarkService.isBookmarked(boardId, userInfo.getUid());
        return ResponseEntity.ok(bookmarked);
    }

    @Operation(summary = "북마크 추가", description = "게시글을 북마크한다.")
    @ApiResponse(responseCode = "200", description = "북마크 성공")
    @PostMapping("/{boardId}")
    public ResponseEntity<Void> insertBookmark(
            @PathVariable int boardId,
            @AuthenticationPrincipal UserTokenDTO userInfo
    ) {
        boardBookmarkService.insertBookmark(boardId, userInfo.getUid());
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "북마크 취소", description = "게시글 북마크를 취소한다.")
    @ApiResponse(responseCode = "200", description = "취소 성공")
    @DeleteMapping("/{boardId}")
    public ResponseEntity<Void> deleteBookmark(
            @PathVariable int boardId,
            @AuthenticationPrincipal UserTokenDTO userInfo
    ) {
        boardBookmarkService.deleteBookmark(boardId, userInfo.getUid());
        return ResponseEntity.ok().build();
    }

    // 내 북마크 목록 조회
    @Operation(summary = "내 북마크 목록 조회", description = "사용자가 북마크한 게시글 전체 목록을 조회한다.")
    @ApiResponse(
            responseCode = "200",
            description = "조회 성공",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = BoardResponseDTO.class)))
    )
    @GetMapping("/list/all")
    public ResponseEntity<List<BoardResponseDTO>> getMyBookmarks(
            @AuthenticationPrincipal UserTokenDTO userInfo
    ) {
        return ResponseEntity.ok(boardBookmarkService.getBookmarkedList(userInfo.getUid()));
    }
}
