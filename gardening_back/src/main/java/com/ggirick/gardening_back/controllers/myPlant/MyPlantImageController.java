package com.ggirick.gardening_back.controllers.myPlant;

import com.ggirick.gardening_back.dto.auth.UserTokenDTO;
import com.ggirick.gardening_back.dto.myPlant.MyPlantImageDTO;
import com.ggirick.gardening_back.dto.myPlant.MyPlantImageResponseDTO;
import com.ggirick.gardening_back.services.myPlant.MyPlantImageService;
import com.ggirick.gardening_back.services.myPlant.MyPlantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/my-plant/{userPlantId}")
public class MyPlantImageController {
    private final MyPlantImageService myPlantImageService;
    private final MyPlantService myPlantService;

    // userPlantId로 등록한 식물의 대표 이미지 조회
    @Operation(
            summary = "userPlantId로 식물의 대표 이미지 조회",
            description = "userPlantId를 전달하면 해당 식물의 대표 이미지을 조회한다."
    )
    @ApiResponse(
            responseCode = "200",
            description = "조회 성공",
            content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = MyPlantImageDTO.class)
            )
    )
    @GetMapping()
    public ResponseEntity<MyPlantImageDTO> getImageByPlantId(
            @PathVariable int userPlantId,
            @AuthenticationPrincipal UserTokenDTO userInfo
    ) {
        // 권한 체크 1 - 식물 소유자인지
        if(!myPlantService.getOwnerUidByPlantId(userPlantId).equals(userInfo.getUid())) {
            return ResponseEntity.status(403).build(); // Forbidden
        }

        return ResponseEntity.ok(myPlantImageService.getThumbnailByPlantId(userPlantId));
    }

    // imageId로 대표 이미지 조회
    @Operation(summary = "imageId로 대표 이미지 조회", description = "imageId로 단일 이미지 정보를 조회한다.")
    @ApiResponse(
            responseCode = "200",
            description = "조회 성공",
            content = @Content(schema = @Schema(implementation = MyPlantImageDTO.class))
    )
    @GetMapping("/image/{imageId}")
    public ResponseEntity<MyPlantImageResponseDTO> getImageById(
            @PathVariable int userPlantId,
            @PathVariable int imageId,
            @AuthenticationPrincipal UserTokenDTO userInfo
    ) {
        // 권한 체크 1 - 이미지가 해당 식물 것인지 먼저 확인
        if (myPlantImageService.validateImageBelongsToPlant(imageId, userPlantId) == 0) {
            return ResponseEntity.status(403).build();
        }

        // 권한 체크 2 - 소유자 확인
        if (!myPlantImageService.getOwnerUidByPlantImageId(imageId).equals(userInfo.getUid())) {
            return ResponseEntity.status(403).build();
        }

        MyPlantImageResponseDTO dto = myPlantImageService.getImageById(imageId);

        // 조회 결과 없다면
        if (dto == null) return ResponseEntity.notFound().build();

        return ResponseEntity.ok(dto);
    }
}
