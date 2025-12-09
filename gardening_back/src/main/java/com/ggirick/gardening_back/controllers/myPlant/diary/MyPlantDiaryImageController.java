package com.ggirick.gardening_back.controllers.myPlant.diary;

import com.ggirick.gardening_back.dto.auth.UserTokenDTO;
import com.ggirick.gardening_back.dto.myPlant.diary.MyPlantDiaryImageResponseDTO;
import com.ggirick.gardening_back.services.myPlant.diary.MyPlantDiaryImageService;
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
@RequestMapping("/my-plant/{userPlantId}/diary/image")
public class MyPlantDiaryImageController {

    private final MyPlantDiaryImageService diaryImageService;
    private final MyPlantService plantService;

    // 특정 식물의 모든 다이어리 이미지 조회
    @Operation(
            summary = "식물의 모든 다이어리 이미지 조회",
            description = "userPlantId 기준으로 해당 식물에 속한 모든 다이어리 이미지를 조회합니다."
    )
    @ApiResponse(
            responseCode = "200",
            description = "조회 성공",
            content = @Content(
                    array = @ArraySchema(schema = @Schema(implementation = MyPlantDiaryImageResponseDTO.class))
            )
    )
    @GetMapping
    public ResponseEntity<List<MyPlantDiaryImageResponseDTO>> getImageByPlantId(
            @PathVariable int userPlantId,
            @AuthenticationPrincipal UserTokenDTO userInfo
    ) {

        // 권한 체크 1 - 식물 소유자인지
        if (!plantService.getOwnerUidByPlantId(userPlantId)
                .equals(userInfo.getUid())) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(diaryImageService.getImagesByPlantId(userPlantId));
    }

    // 다이어리 이미지 단건 조회
    @Operation(
            summary = "다이어리 이미지 단건 조회",
            description = "imageId로 해당 이미지 정보를 조회합니다."
    )
    @ApiResponse(
            responseCode = "200",
            description = "조회 성공",
            content = @Content(schema = @Schema(implementation = MyPlantDiaryImageResponseDTO.class))
    )
    @GetMapping("/{imageId}")
    public ResponseEntity<MyPlantDiaryImageResponseDTO> getImageById(
            @PathVariable int userPlantId,
            @PathVariable int imageId,
            @AuthenticationPrincipal UserTokenDTO userInfo
    ) {
        // 권한 체크 1 - 식물 소유자인지
        if (!plantService.getOwnerUidByPlantId(userPlantId)
                .equals(userInfo.getUid())) {
            return ResponseEntity.status(403).build();
        }

        // 권한 체크 2 - 해당 식물의 다이어리 이미지인지
        if (diaryImageService.validateDiaryImageBelongsToPlant(userPlantId, imageId) == 0) {
            return ResponseEntity.status(403).build();
        }

        MyPlantDiaryImageResponseDTO dto = diaryImageService.getImageById(imageId);
        if (dto == null) return ResponseEntity.notFound().build(); // 404

        return ResponseEntity.ok(dto);
    }
}
