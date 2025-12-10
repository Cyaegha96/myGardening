package com.ggirick.gardening_back.controllers.myPlant;

import com.ggirick.gardening_back.dto.myPlant.MyPlantDTO;
import com.ggirick.gardening_back.dto.myPlant.MyPlantResponseDTO;
import com.ggirick.gardening_back.dto.auth.UserTokenDTO;
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
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/my-plant")
public class MyPlantController {

    private final MyPlantService myPlantService;

    // 사용자별 식물 목록 조회
    @Operation(
            summary = "등록한 식물 목록 조회",
            description = "로그인한 사용자의 모든 식물 목록을 대표 이미지(1장 포함)와 함께 조회합니다."
    )
    @ApiResponse(
            responseCode = "200",
            description = "조회 성공",
            content = @Content(
                    mediaType = "application/json",
                    array = @ArraySchema(schema = @Schema(implementation = MyPlantResponseDTO.class))
            )
    )
    @GetMapping
    public ResponseEntity<List<MyPlantResponseDTO>> getMyPlantList(
            @AuthenticationPrincipal UserTokenDTO userInfo
    ) {
        String userUid = userInfo.getUid();
        return ResponseEntity.ok(myPlantService.getListByUserUid(userUid));
    }

    // 식물 상세 조회
    @Operation(
            summary = "식물 상세 조회",
            description = "userPlantId 기준으로 대표 이미지 및 기본 정보를 조회합니다."
    )
    @ApiResponse(
            responseCode = "200",
            description = "조회 성공",
            content = @Content(schema = @Schema(implementation = MyPlantResponseDTO.class))
    )
    @GetMapping("/{userPlantId}")
    public ResponseEntity<MyPlantResponseDTO> getMyPlant(
            @PathVariable("userPlantId") int userPlantId,
            @AuthenticationPrincipal UserTokenDTO userInfo
    ) {
        // 권한 체크
        if (!checkOwner(userPlantId, userInfo.getUid())) {
            return ResponseEntity.status(403).build(); // Forbidden
        }

        return ResponseEntity.ok(myPlantService.getByPlantId(userPlantId));
    }

    // 새로운 식물 등록
    @Operation(
            summary = "새로운 식물 등록",
            description = "사용자 UID, 식물 학명, 식물 별명, 메모, 획득일(등록일)을 입력받아 저장합니다."
    )
    @ApiResponse(responseCode = "200", description = "등록 성공")
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Void> insertMyPlant(
            @AuthenticationPrincipal UserTokenDTO userInfo,
            @RequestPart("myPlantInfo") MyPlantDTO dto,
            @RequestPart(value = "file") MultipartFile file
    ) throws Exception {

        // 권한 체크 1 - 식물 소유자인지 (등록은 로그인한 본인이므로 기본 만족)
        dto.setUserUid(userInfo.getUid());

        myPlantService.insert(dto, file, userInfo.getUid());
        return ResponseEntity.ok().build();
    }

    // 식물 정보 수정
    @Operation(
            summary = "식물 정보 수정",
            description = "식물 별명, 메모, 획득일(acquiredAt), 상태(status), 대표이미지 수정"
    )
    @ApiResponse(responseCode = "200", description = "수정 성공")
    @PutMapping(consumes = "multipart/form-data")
    public ResponseEntity<Void> updateMyPlant(
            @AuthenticationPrincipal UserTokenDTO userInfo,
            @RequestPart("myPlantInfo") MyPlantDTO dto,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) throws Exception {

        // 권한 체크 1 - 식물 소유자인지
        if (!checkOwner(dto.getUserPlantId(), userInfo.getUid())) {
            return ResponseEntity.status(403).build(); // Forbidden
        }

        dto.setUserUid(userInfo.getUid());
        myPlantService.update(dto, file);

        return ResponseEntity.ok().build();
    }

    // 식물 삭제
    @Operation(
            summary = "등록한 식물 삭제",
            description = "식물 ID(userPlantId)를 전달받아 삭제합니다."
    )
    @ApiResponse(responseCode = "200", description = "삭제 성공")
    @DeleteMapping("/{userPlantId}")
    public ResponseEntity<Void> deleteMyPlant(
            @PathVariable("userPlantId") int userPlantId,
            @AuthenticationPrincipal UserTokenDTO userInfo
    ) {
        // 권한 체크 1 - 식물 소유자인지
        if (!checkOwner(userPlantId, userInfo.getUid())) {
            return ResponseEntity.status(403).build(); // Forbidden
        }

        myPlantService.delete(userPlantId);
        return ResponseEntity.ok().build();
    }

    // ------------------------ 공통 권한 체크 ------------------------
    private boolean checkOwner(int userPlantId, String loginUid) {
        String ownerUid = myPlantService.getOwnerUidByPlantId(userPlantId);
        return loginUid.equals(ownerUid);
    }
}
