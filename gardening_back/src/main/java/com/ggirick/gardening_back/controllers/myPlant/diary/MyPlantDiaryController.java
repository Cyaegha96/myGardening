package com.ggirick.gardening_back.controllers.myPlant.diary;

import com.ggirick.gardening_back.dto.auth.UserTokenDTO;
import com.ggirick.gardening_back.dto.myPlant.diary.MyPlantDiaryDTO;
import com.ggirick.gardening_back.services.myPlant.diary.MyPlantDiaryService;
import com.ggirick.gardening_back.services.myPlant.MyPlantService;
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
@RequestMapping("/my-plant/{userPlantId}/diary")
public class MyPlantDiaryController {

    private final MyPlantDiaryService diaryService;
    private final MyPlantService plantService;

    // 특정 식물의 다이어리 목록 조회
    @Operation(
            summary = "식물 다이어리 목록 조회",
            description = "식물 고유번호(userPlantId) 기준으로 해당 식물의 모든 다이어리 목록을 조회합니다."
    )
    @ApiResponse(
            responseCode = "200",
            description = "조회 성공",
            content = @Content(
                    mediaType = "application/json",
                    array = @ArraySchema(schema = @Schema(implementation = MyPlantDiaryDTO.class))
            )
    )
    @GetMapping
    public ResponseEntity<List<MyPlantDiaryDTO>> getDiaryList(
            @PathVariable int userPlantId,
            @AuthenticationPrincipal UserTokenDTO userInfo
    ) {
        // 권한 체크 1 - 식물 소유자인지
        if (!checkOwner(userPlantId, userInfo.getUid())) {
            return ResponseEntity.status(403).build(); // Forbidden 응답
        }

        return ResponseEntity.ok(diaryService.getDiaryByPlantId(userPlantId));
    }

    // 단건 조회
    @Operation(
            summary = "다이어리 단건 조회",
            description = "다이어리 고유번호(diaryId)를 이용하여 일지 내용을 조회합니다."
    )
    @ApiResponse(responseCode = "200", description = "조회 성공")
    @GetMapping("/{diaryId}")
    public ResponseEntity<MyPlantDiaryDTO> getDiary(
            @PathVariable int userPlantId,
            @PathVariable int diaryId,
            @AuthenticationPrincipal UserTokenDTO userInfo
    ) {
        // 권한 체크 1 - 식물 소유자인지
        if (!checkOwner(userPlantId, userInfo.getUid())) {
            return ResponseEntity.status(403).build(); // Forbidden 응답
        }

        // 권한 체크 2 - 해당 식물의 다이어리인지
        if (diaryService.validateDiaryBelongsToPlant(userPlantId, diaryId) == 0) {
            return ResponseEntity.status(403).build(); // Forbidden 응답
        }

        MyPlantDiaryDTO diary = diaryService.getDiaryById(diaryId);
        if (diary == null) { // 조회 결과 없으면
            return ResponseEntity.notFound().build(); // 404
        }

        return ResponseEntity.ok(diary);
    }

    // 다이어리 작성
    @Operation(
            summary = "다이어리 등록",
            description = "식물 고유번호(userPlantId)와 다이어리 내용을 전달받아 저장합니다."
    )
    @ApiResponse(responseCode = "200", description = "등록 성공")
    @PostMapping
    public ResponseEntity<Void> insertDiary(
            @PathVariable int userPlantId,
            @RequestBody MyPlantDiaryDTO dto,
            @AuthenticationPrincipal UserTokenDTO userInfo
    ) {
        // 권한 체크 1 - 식물 소유자인지
        if (!checkOwner(userPlantId, userInfo.getUid())) {
            return ResponseEntity.status(403).build(); // Forbidden 응답
        }
        dto.setUserPlantId(userPlantId);
        diaryService.insertDiary(dto);
        return ResponseEntity.ok().build();
    }

    // 다이어리 수정
    @Operation(
            summary = "다이어리 수정",
            description = "콘텐츠 변경을 지원합니다."
    )
    @ApiResponse(responseCode = "200", description = "수정 성공")
    @PutMapping("/{diaryId}")
    public ResponseEntity<Void> updateDiary(
            @PathVariable int userPlantId,
            @PathVariable int diaryId,
            @RequestBody MyPlantDiaryDTO dto,
            @AuthenticationPrincipal UserTokenDTO userInfo
    ) {
        // 권한 체크 1 - 식물 소유자인지
        if (!checkOwner(userPlantId, userInfo.getUid())) {
            return ResponseEntity.status(403).build(); // Forbidden 응답
        }

        // 권한 체크 2 - 해당 식물의 다이어리인지
        if (diaryService.validateDiaryBelongsToPlant(userPlantId, diaryId) == 0) {
            return ResponseEntity.status(403).build();
        }

        dto.setDiaryId(diaryId);
        dto.setUserPlantId(userPlantId);

        diaryService.updateDiary(dto);

        return ResponseEntity.ok().build();
    }

    // 다이어리 삭제
    @Operation(
            summary = "다이어리 삭제",
            description = "다이어리 고유번호(diaryId)를 전달받아 삭제합니다."
    )
    @ApiResponse(responseCode = "200", description = "삭제 성공")
    @DeleteMapping("/{diaryId}")
    public ResponseEntity<Void> deleteDiary(
            @PathVariable int userPlantId,
            @PathVariable int diaryId,
            @AuthenticationPrincipal UserTokenDTO userInfo
    ) {
        // 권한 체크 1 - 식물 소유자인지
        if (!checkOwner(userPlantId, userInfo.getUid())) {
            return ResponseEntity.status(403).build(); // Forbidden 응답
        }

        // 권한 체크 2 - 해당 식물의 다이어리인지
        if (diaryService.validateDiaryBelongsToPlant(userPlantId, diaryId) == 0) {
            return ResponseEntity.status(403).build();
        }

        diaryService.deleteDiary(diaryId);
        return ResponseEntity.ok().build();
    }

    // ------------------------ 공통 권한 체크 ------------------------
    private boolean checkOwner(int userPlantId, String loginUid) {
        String ownerUid = plantService.getOwnerUidByPlantId(userPlantId);
        return loginUid.equals(ownerUid);
    }
}
