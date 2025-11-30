package com.ggirick.gardening_back.controllers.board;

import com.ggirick.gardening_back.dto.board.BoardFileDTO;
import com.ggirick.gardening_back.dto.board.BoardResponseDTO;
import com.ggirick.gardening_back.services.board.BoardFileService;
import com.ggirick.gardening_back.dto.auth.UserTokenDTO;
import com.ggirick.gardening_back.services.board.BoardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/board/file")
public class BoardFileController {

    private final BoardFileService boardFileService;
    private final BoardService boardService;

    // 게시글 파일 목록 조회
    @Operation(
            summary = "게시글 파일 목록 조회",
            description = "boardId를 전달하면 해당 게시글의 파일 목록을 조회한다."
    )
    @ApiResponse(
            responseCode = "200",
            description = "조회 성공",
            content = @Content(
                    array = @ArraySchema(schema = @Schema(implementation = BoardFileDTO.class))
            )
    )
    @GetMapping("/{boardId}")
    public ResponseEntity<List<BoardFileDTO>> getFilesByBoardId(
            @PathVariable int boardId
    ) {
        return ResponseEntity.ok(boardFileService.getFileListByBoardId(boardId));
    }

    // 파일 단일 조회
    @Operation(summary = "파일 상세 조회", description = "파일 ID로 단일 파일 정보를 조회한다.")
    @ApiResponse(
            responseCode = "200",
            description = "조회 성공",
            content = @Content(schema = @Schema(implementation = BoardFileDTO.class))
    )
    @GetMapping
    public ResponseEntity<BoardFileDTO> getFileDetail(
            @PathVariable int fileId
    ) {
        BoardFileDTO dto = boardFileService.getFileById(fileId);
        if (dto == null) return ResponseEntity.notFound().build();

        return ResponseEntity.ok(dto);
    }
}
