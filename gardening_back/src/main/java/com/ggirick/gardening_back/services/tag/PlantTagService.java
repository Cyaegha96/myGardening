package com.ggirick.gardening_back.services.tag;

import com.ggirick.gardening_back.dto.plant.PlantInfoDTO;
import com.ggirick.gardening_back.dto.tag.PlantTagDTO;
import com.ggirick.gardening_back.dto.tag.PlantTagParentDTO;
import com.ggirick.gardening_back.mappers.tag.PlantTagMapper;
import com.ggirick.gardening_back.services.plant.PlantService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class PlantTagService {
    private final PlantTagMapper plantTagMapper;
    private final PlantService plantService;

    // 이미지 분석해서 받아온 학명 기반으로 태그 목록 가져오기
    public List<PlantTagDTO> getImagePlantTags(MultipartFile file, String organ, String loginUid) throws Exception {
        Optional<String> identifyResult = plantService.identifyPlantImageOnly(file, organ, loginUid);

        // 분석에 실패한다면
        if (identifyResult.isEmpty()) {
            return List.of(); // 빈 배열 반환
        }

        String scientificName = identifyResult.get();
        return getTagsByScientificName(scientificName);
    }

    // PlantAPI bestMatch로 plant_tag_with 연결해서 태그 목록 가져오기
    public List<PlantTagDTO> getTagsByScientificName(String scientificName) {
        if (scientificName == null || scientificName.isBlank()) {
            log.debug("태그 조회 생략 — scientificName이 비어 있음");
            return List.of();
        }

        // 1) 정확한 매칭
        List<PlantTagDTO> exact = plantTagMapper.getTagsByScientificName(scientificName);
        if (!exact.isEmpty()) {
            return exact;
        }

        // 2) fallback: LIKE 기반 검색 (학명의 첫 단어로 검색)
        String firstWord = scientificName.split(" ")[0];

        return plantTagMapper.getTagsByScientificNameLike("%" + firstWord + "%");
    }

    public List<PlantTagDTO> getTagsByIds(List<Integer> tagIds) {
        if (tagIds == null || tagIds.isEmpty()) return List.of();
        return plantTagMapper.getTagsByIds(tagIds);
    }

    // 부모 태그 목록 가져오기
    public List<PlantTagParentDTO> getTagParentList() {
        List<PlantTagParentDTO> raw = plantTagMapper.getTagParentList();

        // description 뒤에 "태그" 제거
        for (PlantTagParentDTO dto : raw) {
            if (dto.getDescription() != null && dto.getDescription().contains("태그")) {
                dto.setDescription(dto.getDescription().replace("태그", "").trim());
            }
        }
        return raw;
    }

    // 부모 기준 자식 태그 ID 전체 가져오기
    public List<String> getChildTagNames(int parentTagId) {
        return plantTagMapper.getChildTagNames(parentTagId);
    }
}
