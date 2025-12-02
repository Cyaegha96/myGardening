package com.ggirick.gardening_back.controllers.potList;

import com.ggirick.gardening_back.services.potList.PotListService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/pot-list")
public class PotListController {
    private final PotListService potListService;

    @Operation(
            summary = "분양글 목록 조회",
            description = "분양글 전체 목록을 조회합니다. 검색 키워드와 필터 옵션 적용이 가능합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
    })
    @GetMapping
    public ResponseEntity<Void> getPotList(
            @Parameter(description = "검색 키워드(옵션)") @RequestParam(required = false) String keyword,
            @Parameter(description = "카테고리 ID(옵션)") @RequestParam(required = false) Long categoryId
    ) {
        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "분양글 상세 조회",
            description = "특정 분양글의 상세 내용을 조회합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 분양글")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Void> getPotDetail(
            @Parameter(description = "분양글 ID") @PathVariable Long id
    ) {
        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "분양글 작성",
            description = "새로운 분양글을 작성합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "작성 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 데이터")
    })
    @PostMapping
    public ResponseEntity<Void> createPot() {
        return ResponseEntity.status(201).build();
    }

    @Operation(
            summary = "분양글 수정",
            description = "기존 분양글을 수정합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "수정 성공"),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 분양글")
    })
    @PatchMapping("/{id}")
    public ResponseEntity<Void> updatePot(
            @Parameter(description = "분양글 ID") @PathVariable Long id
    ) {
        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "분양글 삭제",
            description = "특정 분양글을 삭제합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "삭제 성공"),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 분양글")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePot(
            @Parameter(description = "분양글 ID") @PathVariable Long id
    ) {
        return ResponseEntity.noContent().build();
    }

    @Operation(
            summary = "분양글 거래완료",
            description = "해당 분양글을 거래 완료 상태로 변경합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "처리 성공"),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 분양글")
    })
    @PostMapping("/{id}/complete")
    public ResponseEntity<Void> completePot(
            @Parameter(description = "분양글 ID") @PathVariable Long id
    ) {
        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "분양글 찜",
            description = "해당 분양글을 찜하거나 찜 해제합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "처리 성공"),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 분양글")
    })
    @PostMapping("/{id}/like")
    public ResponseEntity<Void> toggleLike(
            @Parameter(description = "분양글 ID") @PathVariable Long id
    ) {
        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "분양글 끌어올리기",
            description = "해당 분양글을 목록 상단으로 끌어올립니다(bumped 시간 변경)."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "끌어올리기 성공"),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 분양글")
    })
    @PostMapping("/{id}/refresh")
    public ResponseEntity<Void> refreshPot(
            @Parameter(description = "분양글 ID") @PathVariable Long id
    ) {
        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "분양글 신고하기",
            description = "해당 분양글을 신고합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "신고 성공"),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 분양글")
    })
    @PostMapping("/{id}/report")
    public ResponseEntity<Void> reportPot(
            @Parameter(description = "분양글 ID") @PathVariable Long id
    ) {
        return ResponseEntity.ok().build();
    }
}
