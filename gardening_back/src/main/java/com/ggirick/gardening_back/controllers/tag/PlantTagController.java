package com.ggirick.gardening_back.controllers.tag;

import com.ggirick.gardening_back.dto.auth.UserTokenDTO;
import com.ggirick.gardening_back.dto.tag.PlantTagDTO;
import com.ggirick.gardening_back.services.plant.PlantService;
import com.ggirick.gardening_back.services.tag.PlantTagService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/tags")
public class PlantTagController {

    private final PlantTagService plantTagService;

    // 이미지 분석해서 태그 추천
    @Operation(summary = "사진을 기반으로 식물을 추출합니다. 파일 업로드를 사용합니다.",
            description = "결과에 따라 다른 ResponseEntity를 반환한다. 식물이 인식된다면 식물 학명을 포함한 식물 정보를 PlantInfo 형태가 반환된다. ")
    @PostMapping(value = "/recommendTags", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<List<String>> recommendTags(
            @AuthenticationPrincipal UserTokenDTO userTokenDTO,

            @RequestPart(value = "file", required = true) MultipartFile file,
            @RequestParam(value = "organ", defaultValue = "flower") String organ) throws Exception{

        List<PlantTagDTO> list = plantTagService.getImagePlantTags(file, organ, userTokenDTO.getUid());

        List<String> tags = new ArrayList<>();

        // 태그명만 반환
        for(PlantTagDTO plantTagDTO : list ){
            tags.add(plantTagDTO.getTagName());
        }

        return ResponseEntity.ok(tags);
    }

    // 학명 기반 태그 조회
    @Operation(
            summary = "학명 기반 태그 조회",
            description = """
                    PlantNet 분석으로 얻은 식물의 학명(scientificName)을 기반으로
                    연관 태그 목록을 조회한다.
                    
                    우선 정확한 매칭을 시도하고, 없으면 LIKE 검색 기반으로 fallback 조회를 수행한다.
                    """
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = PlantTagDTO.class))
                    )
            )
    })
    @GetMapping
    public ResponseEntity<List<PlantTagDTO>> getTagsByScientificName(
            @RequestParam String scientificName
    ) {
        List<PlantTagDTO> tags = plantTagService.getTagsByScientificName(scientificName);
        return ResponseEntity.ok(tags);
    }

    // tagId 리스트로 태그 복수 조회
    @Operation(
            summary = "태그 ID 목록 기반 조회",
            description = """
                    여러 tagId를 전달하면 해당하는 태그 정보를 한 번에 조회한다.
                    게시글 상세 조회 시 태그 목록 표시 등에 활용된다.
                    """
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = PlantTagDTO.class))
                    )
            )
    })
    @PostMapping
    public ResponseEntity<List<PlantTagDTO>> getTagsByIds(
            @RequestBody List<Integer> tagIds
    ) {
        List<PlantTagDTO> tags = plantTagService.getTagsByIds(tagIds);
        return ResponseEntity.ok(tags);
    }
}
