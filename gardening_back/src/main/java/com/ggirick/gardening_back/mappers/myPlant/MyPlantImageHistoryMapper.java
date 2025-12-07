package com.ggirick.gardening_back.mappers.myPlant;

import com.ggirick.gardening_back.dto.myPlant.MyPlantImageHistoryDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface MyPlantImageHistoryMapper {

    // 1. 히스토리 단건 조회 (PK 기반)
    MyPlantImageHistoryDTO getById(int imageHistoryId);

    // 2. 동일 이미지 재삽입 방지
    int deleteByHash(String hash);

    // 3. 신규 히스토리 저장
    int insert(MyPlantImageHistoryDTO dto);

    // 4. 최신순 히스토리 목록 조회
    List<MyPlantImageHistoryDTO> getHistoryList(int userPlantId);

    // 5. 가장 오래된 기록 조회 (GCP 삭제 위해 필요한 정보)
    MyPlantImageHistoryDTO getOldest(int userPlantId);

    // 6. PK로 히스토리 삭제
    int deleteByHistoryId(int imageHistoryId);
}
