package com.ggirick.gardening_back.controllers.potList;

import com.ggirick.gardening_back.dto.auth.UserTokenDTO;
import com.ggirick.gardening_back.dto.potList.*;
import com.ggirick.gardening_back.services.potList.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;

import static com.ggirick.gardening_back.config.PotListConfig.BUMP_LIMIT_SECONDS;

@RestController
@RequiredArgsConstructor
@RequestMapping("/pot-list")
public class PotListController {
    private final PotListService potListService;
    private final PotListBookmarkService potListBookmarkService;
    private final PotListReportService potListReportService;
    private final PotListProcessService potListProcessService;
    private final PotListImageService potListImageService;
    private final PotListTagMappingService potListTagMappingService;

    @Operation(
            summary = "분양글 목록 조회",
            description = "분양글 전체 목록을 조회합니다. 검색 키워드와 필터 옵션 적용이 가능합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
    })
    @GetMapping
    public ResponseEntity<List<PotListDetailDTO>> getPotList(@Parameter(description = "커서 위치 저장용") @RequestParam(required = false) OffsetDateTime cursorId,
                                                             @Parameter(description = "한번에 조회할 목록 갯수") @RequestParam(defaultValue = "16") int size,
                                                             @Parameter(description = "검색 키워드(옵션)") @RequestParam(required = false) String keyword,
                                                             @Parameter(description = "검색 필터(제목, 작성자, 내용)") @RequestParam(required = false) String searchType,
                                                             @Parameter(description = "카테고리 ID(옵션)") @RequestParam(required = false) List<Integer> categoryId,
                                                             @Parameter(description = "지역 필터") @RequestParam(required = false) String location) {
        return ResponseEntity.ok(potListService.getPotList(cursorId, size, keyword, searchType, categoryId, location));
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
    public ResponseEntity<PotListResponseDTO> getPotDetail(@Parameter(description = "분양글 ID") @PathVariable int id) {
        PotListDetailDTO pot = potListService.getPotById(id);
        if (pot != null) {
            potListService.addViewCount(id);

            PotListDetailDTO potListDetailDTO = potListService.getPotById(id);
            potListDetailDTO.setTags(potListTagMappingService.getTagByPotListingId(id).stream().map(PotListTagMappingDTO::getPlantTagId).toList());
            List<PotListImageDTO> potListImageDTOList = potListImageService.getImagesByPotListingId(id);
            List<PotListDetailDTO> otherPots = potListService.getPotByUserId(potListDetailDTO.getWriterUid());

            return ResponseEntity.ok(PotListResponseDTO.builder()
                    .potListDetailDTO(potListDetailDTO)
                    .potListImageDTOList(potListImageDTOList)
                    .otherPotList(otherPots)
                    .build());
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @Operation(
            summary = "분양글 작성",
            description = "새로운 분양글을 작성합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "작성 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 데이터")
    })
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> createPot(@Parameter(description = "입력 할 분양글 정보") @RequestPart("potListInfo") PotListInsertDTO insertInfo,
                                          @Parameter(description = "분양글 이미지 목록") @RequestPart(value = "images", required = false) List<MultipartFile> images,
                                          @Parameter(description = "요청을 보낸 사용자 정보") @AuthenticationPrincipal UserTokenDTO userInfo) throws Exception {
        if (userInfo != null) {
            if (!potListImageService.validateImagesInfo(images)) {
                // 최대 이미지 개수 혹은 용량을 초과한 경우
                return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).build();
            }

            insertInfo.setWriterUid(userInfo.getUid());
            potListProcessService.insertPotProcess(images, insertInfo);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @Operation(
            summary = "분양글 수정",
            description = "기존 분양글을 수정합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "수정 성공"),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 분양글")
    })
    @PatchMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> updatePot(@Parameter(description = "분양글 ID") @PathVariable int id,
                                          @Parameter(description = "수정 할 분양글 정보") @RequestPart("potListInfo") PotListPatchDTO patchInfo,
                                          @Parameter(description = "분양글 이미지 목록") @RequestPart(value = "images", required = false) List<MultipartFile> images,
                                          @Parameter(description = "요청을 보낸 사용자 정보") @AuthenticationPrincipal UserTokenDTO userInfo) throws Exception {
        if (userInfo != null) {
            if (!potListImageService.validateImagesInfo(images)) {
                // 최대 이미지 개수 혹은 용량을 초과한 경우
                return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).build();
            }

            PotListDetailDTO potInfo = potListService.getPotById(id);
            if (potInfo.getWriterUid().equals(userInfo.getUid())) {
                potListProcessService.updatePotProcess(id, images, patchInfo);
                return ResponseEntity.ok().build();
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
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
    public ResponseEntity<Void> deletePot(@Parameter(description = "분양글 ID") @PathVariable int id,
                                          @Parameter(description = "요청을 보낸 사용자 정보") @AuthenticationPrincipal UserTokenDTO userInfo) {
        if (userInfo != null) {
            PotListDetailDTO potInfo = potListService.getPotById(id);
            if (potInfo.getWriterUid().equals(userInfo.getUid())) {
                potListProcessService.deletePotProcess(id);
                return ResponseEntity.noContent().build();
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @Operation(
            summary = "분양글 거래완료",
            description = "해당 분양글을 거래 완료 상태로 변경합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "처리 성공"),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 분양글")
    })
    @PatchMapping("/{id}/complete")
    public ResponseEntity<Void> completePot(@Parameter(description = "분양글 ID") @PathVariable int id,
                                            @Parameter(description = "요청을 보낸 사용자 정보") @AuthenticationPrincipal UserTokenDTO userInfo) {
        if (userInfo != null) {
            PotListDetailDTO potInfo = potListService.getPotById(id);
            if (potInfo.getWriterUid().equals(userInfo.getUid())) {
                potListService.completeTrade(id);
                return ResponseEntity.ok().build();
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @Operation(
            summary = "분양글 거래예약",
            description = "해당 분양글을 거래 예약 상태로 변경합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "처리 성공"),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 분양글")
    })
    @PatchMapping("/{id}/reserve")
    public ResponseEntity<Void> reservePot(@Parameter(description = "분양글 ID") @PathVariable int id,
                                           @Parameter(description = "요청을 보낸 사용자 정보") @AuthenticationPrincipal UserTokenDTO userInfo) {
        if (userInfo != null) {
            PotListDetailDTO potInfo = potListService.getPotById(id);
            if (potInfo.getWriterUid().equals(userInfo.getUid())) {
                potListService.reserveTrade(id);
                return ResponseEntity.ok().build();
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @Operation(
            summary = "분양글 판매중",
            description = "해당 분양글을 판매중 상태로 변경합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "처리 성공"),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 분양글")
    })
    @PatchMapping("/{id}/before")
    public ResponseEntity<Void> beforePot(@Parameter(description = "분양글 ID") @PathVariable int id,
                                          @Parameter(description = "요청을 보낸 사용자 정보") @AuthenticationPrincipal UserTokenDTO userInfo) {
        if (userInfo != null) {
            PotListDetailDTO potInfo = potListService.getPotById(id);
            if (potInfo.getWriterUid().equals(userInfo.getUid())) {
                potListService.beforeTrade(id);
                return ResponseEntity.ok().build();
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @Operation(
            summary = "분양글 끌어올리기",
            description = "해당 분양글을 목록 상단으로 끌어올립니다(bumped 시간 변경)."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "끌어올리기 성공"),
            @ApiResponse(responseCode = "401", description = "권한 없음"),
            @ApiResponse(responseCode = "425", description = "끌어올리기 쿨타임 이전")
    })
    @PatchMapping("/{id}/bump")
    public ResponseEntity<Void> refreshPot(@Parameter(description = "분양글 ID") @PathVariable int id,
                                           @Parameter(description = "요청을 보낸 사용자 정보") @AuthenticationPrincipal UserTokenDTO userInfo) {
        if (userInfo == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        PotListDetailDTO potInfo = potListService.getPotById(id);

        // 작성자 검증
        if (!potInfo.getWriterUid().equals(userInfo.getUid())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Timestamp lastBumpedTs = potInfo.getBumpedAt();

        if (lastBumpedTs != null) {
            LocalDateTime lastBumped = lastBumpedTs.toLocalDateTime();
            LocalDateTime nextAvailableTime = lastBumped.plusSeconds(BUMP_LIMIT_SECONDS);
            LocalDateTime now = LocalDateTime.now();

            if (nextAvailableTime.isAfter(now)) {
                return ResponseEntity.status(HttpStatus.TOO_EARLY).build();
            }
        }

        potListService.bumpPot(id);
        return ResponseEntity.noContent().build();
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
    public ResponseEntity<Void> toggleLike(@Parameter(description = "분양글 ID") @PathVariable int id,
                                           @Parameter(description = "요청을 보낸 사용자 정보") @AuthenticationPrincipal UserTokenDTO userInfo) {
        if (userInfo != null) {
            potListBookmarkService.togglePotListBookmark(id, userInfo.getUid());
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @Operation(
            summary = "분양글 찜 목록",
            description = "사용자의 분양글 찜 목록을 조회합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "처리 성공")
    })
    @GetMapping("/like")
    public ResponseEntity<List<PotListDetailDTO>> getBookmarksByUserId(@Parameter(description = "요청을 보낸 사용자 정보") @AuthenticationPrincipal UserTokenDTO userInfo) {
        if (userInfo != null) {
            return ResponseEntity.ok(potListBookmarkService.getBookmarksByUserId(userInfo.getUid()));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
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
    public ResponseEntity<Void> reportPot(@Parameter(description = "분양글 ID") @PathVariable int id,
                                          @Parameter(description = "신고 내용") @RequestBody PotListReportInsertDTO reportInfo,
                                          @Parameter(description = "요청을 보낸 사용자 정보") @AuthenticationPrincipal UserTokenDTO userInfo) {
        if (userInfo != null) {
            reportInfo.setReporterUid(userInfo.getUid());
            potListReportService.reportPotById(id, reportInfo);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }


    @Operation(
            summary = "내 분양글 목록 조회",
            description = "로그인한 사용자가 작성한 분양글 목록을 조회합니다."
    )
    @GetMapping("/my")
    public ResponseEntity<List<PotListDetailDTO>> getMyPotList(
            @AuthenticationPrincipal UserTokenDTO userInfo) {

        if (userInfo == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<PotListDetailDTO> myPots = potListService.getPotByUserId(userInfo.getUid());
        return ResponseEntity.ok(myPots);
    }
}
