package com.ggirick.gardening_back.mappers.myPlant.diary;

import com.ggirick.gardening_back.dto.myPlant.diary.MyPlantDiaryDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MyPlantDiaryMapper {
    // 단일 조회
    MyPlantDiaryDTO getDiaryById(int diaryId);

    // 식물별 다이어리 목록 조회
    List<MyPlantDiaryDTO> getDiaryByPlantId(@Param("userPlantId") int userPlantId);

    // 식물별 첫번째 다이어리 ID 조회 - 가장 오래된 다이어리
    Integer getFirstDiaryId(int userPlantId);

    // 다이어리 등록
    int insertDiary(MyPlantDiaryDTO dto);

    // 다이어리 수정
    int updateDiary(MyPlantDiaryDTO dto);

    // 다이어리 삭제
    int deleteDiary(int diaryId);

    // 권한 체크용 diaryId → userPlantId 조회
    int validateDiaryBelongsToPlant(@Param("userPlantId") int userPlantId,
                                    @Param("diaryId") int diaryId);
}
