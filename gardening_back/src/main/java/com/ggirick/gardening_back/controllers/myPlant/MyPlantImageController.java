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
@RequestMapping("/my-plant")
public class MyPlantImageController {

    private final MyPlantImageService myPlantImageService;
    private final MyPlantService myPlantService;

    // userPlantId로 대표 이미지 조회
    @Operation(
            summary = "대표 이미지 조회",
            description = "식물(userPlantId)의 대표 이미지를 조회합니다."
    )
    @ApiResponse(
            responseCode = "200",
            description = "조회 성공",
            content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = MyPlantImageDTO.class)
            )
    )
    @GetMapping("/{userPlantId}/image")
    public ResponseEntity<MyPlantImageDTO> getThumbnailImage(
            @PathVariable("userPlantId") int userPlantId,
            @AuthenticationPrincipal UserTokenDTO userInfo
    ) {

        // 권한 체크
        if(!myPlantService.getOwnerUidByPlantId(userPlantId).equals(userInfo.getUid())) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(
                myPlantImageService.getThumbnailByPlantId(userPlantId)
        );
    }

    // imageId로 이미지 조회 (히스토리 포함)
    @Operation(summary = "imageId로 이미지 조회")
    @ApiResponse(responseCode = "200", description = "조회 성공")
    @GetMapping("/image/{imageId}")
    public ResponseEntity<MyPlantImageResponseDTO> getImageById(
            @PathVariable int imageId,
            @AuthenticationPrincipal UserTokenDTO userInfo
    ) {

        if (!myPlantImageService.getOwnerUidByPlantImageId(imageId).equals(userInfo.getUid())) {
            return ResponseEntity.status(403).build();
        }

        MyPlantImageResponseDTO dto = myPlantImageService.getImageById(imageId);

        if (dto == null) return ResponseEntity.notFound().build();

        return ResponseEntity.ok(dto);
    }
}
