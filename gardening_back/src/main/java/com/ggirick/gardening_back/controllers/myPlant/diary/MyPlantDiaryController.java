package com.ggirick.gardening_back.controllers.myPlant.diary;

import com.ggirick.gardening_back.dto.auth.UserTokenDTO;
import com.ggirick.gardening_back.dto.myPlant.diary.MyPlantDiaryDTO;
import com.ggirick.gardening_back.dto.myPlant.diary.MyPlantDiaryResponseDTO;
import com.ggirick.gardening_back.services.myPlant.MyPlantService;
import com.ggirick.gardening_back.services.myPlant.diary.MyPlantDiaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/my-plant/{userPlantId}/diary")
public class MyPlantDiaryController {

    private final MyPlantDiaryService diaryService;
    private final MyPlantService plantService;

    // 다이어리 목록 조회 (페이징)
    @Operation(
            summary = "식물 다이어리 전체 조회",
            description = "특정 식물의 모든 일지를 최신순으로 전체 조회합니다."
    )
    @ApiResponse(
            responseCode = "200",
            description = "조회 성공",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = MyPlantDiaryResponseDTO.class)))
    )
    @GetMapping
    public ResponseEntity<List<MyPlantDiaryResponseDTO>> getDiaryList(
            @PathVariable int userPlantId
    ) {
        List<MyPlantDiaryResponseDTO> list = diaryService.getDiaryList(userPlantId);
        return ResponseEntity.ok(list);
    }

    // 단건 조회
    @Operation(
            summary = "다이어리 단건 조회",
            description = "다이어리ID를 기준으로 다이어리 정보를 조회합니다."
    )
    @ApiResponse(responseCode = "200", description = "조회 성공")
    @GetMapping("/{diaryId}")
    public ResponseEntity<MyPlantDiaryDTO> getDiary(
            @PathVariable int userPlantId,
            @PathVariable int diaryId,
            @AuthenticationPrincipal UserTokenDTO userInfo
    ) {
        // 권한 체크
        if (!checkOwner(userPlantId, userInfo.getUid())
                || diaryService.validateDiaryBelongsToPlant(userPlantId, diaryId) == 0) {
            return ResponseEntity.status(403).build();
        }

        MyPlantDiaryDTO diary = diaryService.getDiaryById(diaryId);
        if (diary == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(diary);
    }

    // 다이어리 등록
    @Operation(
            summary = "다이어리 등록",
            description = "식물 다이어리 내용을 저장합니다. 이미지 첨부 가능."
    )
    @ApiResponse(responseCode = "200", description = "등록 성공")
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Void> insertDiary(
            @PathVariable int userPlantId,
            @RequestPart("myPlantDiary") MyPlantDiaryDTO dto,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @AuthenticationPrincipal UserTokenDTO userInfo
    ) throws Exception {
        String loginUid = userInfo.getUid();

        // 권한 체크
        if (!checkOwner(userPlantId, loginUid)) {
            return ResponseEntity.status(403).build();
        }

        dto.setUserPlantId(userPlantId);
        diaryService.insertDiary(dto, file, loginUid);

        return ResponseEntity.ok().build();
    }

    // 다이어리 수정
    @Operation(
            summary = "다이어리 수정",
            description = "텍스트와 이미지를 수정할 수 있습니다."
    )
    @ApiResponse(responseCode = "200", description = "수정 성공")
    @PutMapping(value = "/{diaryId}", consumes = "multipart/form-data")
    public ResponseEntity<Void> updateDiary(
            @PathVariable("userPlantId") int userPlantId,
            @PathVariable("diaryId") int diaryId,
            @RequestPart("myPlantDiary") MyPlantDiaryDTO dto,
            @RequestPart(value = "isDeleteImage", required = false) Boolean isDeleteImage,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @AuthenticationPrincipal UserTokenDTO userInfo
    ) throws Exception{
    String loginUid = userInfo.getUid();

        // 권한 체크
        if (!checkOwner(userPlantId, loginUid)
                || diaryService.validateDiaryBelongsToPlant(userPlantId, diaryId) == 0) {
            return ResponseEntity.status(403).build();
        }

        dto.setDiaryId(diaryId);
        dto.setUserPlantId(userPlantId);

        diaryService.updateDiary(dto, file, isDeleteImage);

        return ResponseEntity.ok().build();
    }

    // 다이어리 삭제
    @Operation(
            summary = "다이어리 삭제",
            description = "다이어리를 삭제합니다."
    )
    @ApiResponse(responseCode = "200", description = "삭제 성공")
    @DeleteMapping("/{diaryId}")
    public ResponseEntity<Void> deleteDiary(
            @PathVariable int userPlantId,
            @PathVariable int diaryId,
            @AuthenticationPrincipal UserTokenDTO userInfo
    ) {
        // 권한 체크
        if (!checkOwner(userPlantId, userInfo.getUid())
                || diaryService.validateDiaryBelongsToPlant(userPlantId, diaryId) == 0) {
            return ResponseEntity.status(403).build();
        }

        diaryService.deleteDiary(diaryId);
        return ResponseEntity.ok().build();
    }

    // 공통 권한 체크
    private boolean checkOwner(int userPlantId, String loginUid) {
        String ownerUid = plantService.getOwnerUidByPlantId(userPlantId);
        return loginUid.equals(ownerUid);
    }
}
