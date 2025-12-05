package com.ggirick.gardening_back.controllers.tag;

import com.ggirick.gardening_back.dto.auth.UserTokenDTO;
import com.ggirick.gardening_back.dto.tag.PlantTagDTO;
import com.ggirick.gardening_back.dto.tag.PlantTagParentDTO;
import com.ggirick.gardening_back.services.tag.PlantTagService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

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
            @RequestParam(value = "organ", defaultValue = "flower") String organ) throws Exception {

        List<PlantTagDTO> list = plantTagService.getImagePlantTags(file, organ, userTokenDTO.getUid());

        List<String> tags = new ArrayList<>();

        // 태그명만 반환
        for (PlantTagDTO plantTagDTO : list) {
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

    // 식물 부모 태그 목록 조회
    @Operation(
            summary = "식물 부모 태그 목록 조회",
            description = """
                    PLANT_TAG_PARENT 테이블에서 조회하는 API입니다.
                    tagName 은 서버 필터용 값이고,
                    description 은 화면 표시용 텍스트입니다.
                    description 뒤의 '태그' 문자열은 서버단에서 자동 제거하여 내려갑니다.
                    """
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = PlantTagParentDTO.class))
                    )
            )
    })
    @GetMapping("/tagParent")
    public ResponseEntity<List<PlantTagParentDTO>> getTagParents() {
        List<PlantTagParentDTO> list = plantTagService.getTagParentList();
        return ResponseEntity.ok(list);
    }

    // 식물 부모 태그에 따른 세부 태그 목록 조회
    @Operation(
            summary = "식물 부모 태그 아이디에 해당하는 자식 태그 목록 조회",
            description = """
                    PLANT_TAG 테이블에서 조회하는 API입니다.
                    """
    )
    @GetMapping("/tagParent/{parentId}/child")
    public ResponseEntity<List<PlantTagDTO>> getTagListByParentId(@Parameter(description = "자식 태그 목록을 조회할 부모 태그") @PathVariable int parentId) {
        List<PlantTagDTO> list = plantTagService.getChildTagByParent(parentId);
        return ResponseEntity.ok(list);
    }
}
