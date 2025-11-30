package com.ggirick.gardening_back.mappers.tag;

import com.ggirick.gardening_back.dto.tag.PlantTagDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PlantTagMapper {
    // 정확한 학명으로 검색
    List<PlantTagDTO> getTagsByScientificName(@Param("scientificName") String scientificName);

    // LIKE 기반 검색 (fallback)
    List<PlantTagDTO> getTagsByScientificNameLike(@Param("nameLike") String nameLike);

    // 태그 ID 리스트 검색
    List<PlantTagDTO> getTagsByIds(@Param("tagIds") List<Integer> tagIds);

    List<PlantTagDTO> getTagsAll();

    void insertPlantTags(
            @Param("scientificName") String scientificName,
            @Param("tagIds") List<Integer> tagIds
    );
}
