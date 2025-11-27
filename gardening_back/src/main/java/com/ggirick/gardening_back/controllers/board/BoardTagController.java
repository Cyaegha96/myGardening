package com.ggirick.gardening_back.controllers.board;

import com.ggirick.gardening_back.dto.board.BoardTagDTO;
import com.ggirick.gardening_back.services.board.BoardTagService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/board/{boardId}/tag")
public class BoardTagController {

    private final BoardTagService boardTagService;

    // 게시글에 연결된 태그 조회
    @Operation(
            summary = "게시글 태그 조회",
            description = "해당 게시글에 연결된 전체 태그를 반환한다."
    )
    @ApiResponse(
            responseCode = "200",
            description = "조회 성공",
            content = @Content(
                    mediaType = "application/json",
                    array = @ArraySchema(schema = @Schema(implementation = BoardTagDTO.class))
            )
    )
    @GetMapping
    public ResponseEntity<List<BoardTagDTO>> getTagsByBoardId(
            @PathVariable int boardId
    ) {
        return ResponseEntity.ok(boardTagService.getTagsByBoardId(boardId));
    }
}