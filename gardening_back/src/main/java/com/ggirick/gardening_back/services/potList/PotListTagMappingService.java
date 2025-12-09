package com.ggirick.gardening_back.services.potList;

import com.ggirick.gardening_back.dto.potList.PotListTagMappingDTO;
import com.ggirick.gardening_back.mappers.potList.PotListTagMappingMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PotListTagMappingService {
    private final PotListTagMappingMapper potListTagMappingMapper;

    // 태그 등록
    public void insertTag(int potListingId, int plantTagId) {
        potListTagMappingMapper.insertTag(potListingId, plantTagId);
    }

    // 태그 매핑 조회
    public List<PotListTagMappingDTO> getTagByPotListingId(int potListingId) {
        return potListTagMappingMapper.getTagByPotListingId(potListingId);
    }

    // 태그 매핑 삭제
    public void deleteTagById(int id) {
        potListTagMappingMapper.deleteTagById(id);
    }
}
