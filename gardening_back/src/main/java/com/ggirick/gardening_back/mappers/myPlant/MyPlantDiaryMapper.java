package com.ggirick.gardening_back.mappers.myPlant;

import com.ggirick.gardening_back.dto.myPlant.MyPlantDiaryDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MyPlantDiaryMapper {
    // 단일 조회
    MyPlantDiaryDTO getDiaryById(int diaryId);

    // 식물별 다이어리 목록 조회
    List<MyPlantDiaryDTO> getDiaryByPlantId(@Param("userPlantId") int userPlantId);

    // 다이어리 등록
    int insertDiary(MyPlantDiaryDTO dto);

    // 다이어리 수정
    int updateDiary(MyPlantDiaryDTO dto);

    // 다이어리 삭제
    int deleteDiary(int diaryId);
}
