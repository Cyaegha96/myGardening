package com.ggirick.gardening_back.controllers.myPlant;

import com.ggirick.gardening_back.dto.auth.UserTokenDTO;
import com.ggirick.gardening_back.dto.myPlant.MyPlantImageHistoryResponseDTO;
import com.ggirick.gardening_back.services.myPlant.MyPlantService;
import com.ggirick.gardening_back.services.myPlant.MyPlantImageService;

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
@RequestMapping("/my-plant/{userPlantId}/image/history")
public class MyPlantImageHistoryController {

    private final MyPlantService myPlantService;
    private final MyPlantImageService imageService;

    // 권한 공통 체크
    private boolean checkOwner(int userPlantId, String loginUid) {
        String ownerUid = myPlantService.getOwnerUidByPlantId(userPlantId);
        return loginUid.equals(ownerUid);
    }

    // 히스토리 목록 조회
    @Operation(
            summary = "대표 이미지 히스토리 조회",
            description = "최근 3개의 대표 이미지(히스토리)를 최신순으로 조회합니다."
    )
    @ApiResponse(
            responseCode = "200",
            description = "조회 성공",
            content = @Content(
                    mediaType = "application/json",
                    array = @ArraySchema(schema = @Schema(implementation = MyPlantImageHistoryResponseDTO.class))
            )
    )
    @GetMapping
    public ResponseEntity<List<MyPlantImageHistoryResponseDTO>> getHistory(
            @PathVariable int userPlantId,
            @AuthenticationPrincipal UserTokenDTO userInfo
    ) {
        if (!checkOwner(userPlantId, userInfo.getUid())) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(imageService.getHistoryForResponse(userPlantId));
    }

    // 히스토리 선택하여 대표 이미지 변경
    @Operation(
            summary = "히스토리에서 대표 이미지로 변경",
            description = "히스토리 목록 중 하나를 대표 이미지로 승격합니다."
    )
    @ApiResponse(responseCode = "200", description = "변경 성공")
    @PutMapping("/{imageHistoryId}")
    public ResponseEntity<Void> promoteToThumbnail(
            @PathVariable int userPlantId,
            @PathVariable int imageHistoryId,
            @AuthenticationPrincipal UserTokenDTO userInfo
    ) throws Exception {

        if (!checkOwner(userPlantId, userInfo.getUid())) {
            return ResponseEntity.status(403).build();
        }

        imageService.updateFromHistory(userPlantId, imageHistoryId);
        return ResponseEntity.ok().build();
    }
}
