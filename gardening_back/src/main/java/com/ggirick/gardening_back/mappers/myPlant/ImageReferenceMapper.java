package com.ggirick.gardening_back.mappers.myPlant;

import com.ggirick.gardening_back.dto.myPlant.MyPlantImageDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ImageReferenceMapper {
    // 중복 이미지 조회 (대표 + 히스토리 + 다이어리 전체 범위)
    MyPlantImageDTO findEntityByHash(String hash);

    // 같은 Hash 쓰는 DB가 있는지 조회
    int countByHash(String hash);
}
