package com.ggirick.gardening_back.controllers.board;

import com.ggirick.gardening_back.dto.board.BoardRequestDTO;
import com.ggirick.gardening_back.dto.board.BoardResponseDTO;
import com.ggirick.gardening_back.dto.auth.UserTokenDTO;
import com.ggirick.gardening_back.services.board.BoardService;
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
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/board")
public class BoardController {

    private final BoardService boardService;

    // 1. 커서 기반 목록 조회
    @Operation(
            summary = "게시글 목록 조회 (커서 기반)",
            description = "cursorId 이후의 게시글을 limit 개수만큼 조회한다. 로그인 사용자 있을 경우 좋아요/북마크 여부 포함."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "목록 조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = BoardResponseDTO.class))
                    )
            )
    })
    @GetMapping
    public ResponseEntity<List<BoardResponseDTO>> getList(
            @RequestParam(required = false) Integer cursorId,
            @RequestParam(defaultValue = "9") int limit,
            @AuthenticationPrincipal UserTokenDTO userInfo
    ) {
        String loginUid = (userInfo != null) ? userInfo.getUid() : null;
        return ResponseEntity.ok(boardService.getListByCursor(cursorId, limit, loginUid));
    }

    // 좋아요 Top3 게시글 목록 조회
    @Operation(
            summary = "좋아요 Top3 게시글 목록 조회",
            description = "좋아요 수 기준으로 상위 3개 게시물을 조회한다. 로그인 사용자 있을 경우 좋아요/북마크 여부 포함."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "목록 조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = BoardResponseDTO.class))
                    )
            )
    })
    @GetMapping("/top3")
    public ResponseEntity<List<BoardResponseDTO>> getTop3List(
            @AuthenticationPrincipal UserTokenDTO userInfo
    ) {
        String loginUid = (userInfo != null) ? userInfo.getUid() : null;
        return ResponseEntity.ok(boardService.getTop3List(loginUid));
    }

    // 2. 상세 조회
    @Operation(
            summary = "게시글 상세 조회",
            description = "조회수 증가 포함. 로그인 사용자라면 좋아요/북마크 여부 포함."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "상세 조회 성공",
                    content = @Content(schema = @Schema(implementation = BoardResponseDTO.class))
            ),
            @ApiResponse(responseCode = "404", description = "게시글 없음")
    })
    @GetMapping("/{id}")
    public ResponseEntity<BoardResponseDTO> detail(
            @PathVariable int id,
            @AuthenticationPrincipal UserTokenDTO userInfo
    ) {
        String loginUid = (userInfo != null) ? userInfo.getUid() : null;

        BoardResponseDTO detail = boardService.getDetailById(id, loginUid);
        if (detail == null) return ResponseEntity.notFound().build();

        return ResponseEntity.ok(detail);
    }

    // 3. 공지 목록 조회
    @Operation(
            summary = "공지 게시글 조회",
            description = "공지글(isNotification = Y)만 조회한다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "조회 성공",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = BoardResponseDTO.class)))
            )
    })
    @GetMapping("/notifications")
    public ResponseEntity<List<BoardResponseDTO>> getNotifications() {
        return ResponseEntity.ok(boardService.getNotificationList());
    }

    // 4. 게시글 등록
    @Operation(
            summary = "게시글 등록",
            description = "게시글 정보 + 파일(files) 업로드 방식으로 등록한다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "등록 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Void> insert(
            @AuthenticationPrincipal UserTokenDTO userInfo,
            @RequestPart("boardInfo") BoardRequestDTO dto,
            @RequestPart(value = "files", required = false) List<MultipartFile> files
    ) throws Exception {

        boardService.insert(dto, files, userInfo.getUid());

        // ✔ 성공 시 payload 없이 200 반환
        return ResponseEntity.ok().build();
    }

    // 5. 게시글 수정
    @Operation(
            summary = "게시글 수정",
            description = "게시글 정보, 유지할 파일 목록, 신규 파일 업로드까지 함께 수정한다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "수정 성공"),
            @ApiResponse(responseCode = "404", description = "게시글 없음")
    })
    @PutMapping(consumes = "multipart/form-data")
    public ResponseEntity<Void> updateBoard(
            @AuthenticationPrincipal UserTokenDTO userInfo,
            @RequestPart("boardInfo") BoardRequestDTO dto,
            @RequestPart(value = "newFiles", required = false) List<MultipartFile> newFiles
    ) throws Exception {

        int updated = boardService.update(dto, newFiles, userInfo.getUid());
        if (updated == 0) return ResponseEntity.notFound().build();

        return ResponseEntity.ok().build();
    }

    // 6. 게시글 삭제
    @Operation(
            summary = "게시글 삭제",
            description = "게시글 및 연관된 파일/태그를 모두 삭제한다."
    )
    @ApiResponse(responseCode = "200", description = "삭제 성공")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBoard(@PathVariable int id) {

        int deleted = boardService.delete(id);
        if (deleted == 0) return ResponseEntity.notFound().build();

        return ResponseEntity.ok().build();
    }
}
