package com.ggirick.gardening_back.mappers.myPlant.diary;

import com.ggirick.gardening_back.dto.myPlant.diary.MyPlantDiaryDTO;
import com.ggirick.gardening_back.dto.myPlant.diary.MyPlantDiaryResponseDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MyPlantDiaryMapper {

    // 단일 조회
    MyPlantDiaryDTO getDiaryById(int diaryId);

    // 페이징 목록 조회
    List<MyPlantDiaryResponseDTO> getDiaryListByUserPlantId(int userPlantId);

    // 전체 개수 조회
    int getDiaryCount(@Param("userPlantId") int userPlantId);

    // 가장 오래된 diaryId 조회
    Integer getFirstDiaryId(@Param("userPlantId") int userPlantId);

    // 다이어리 등록
    int insertDiary(MyPlantDiaryDTO dto);

    // 다이어리 수정
    int updateDiary(MyPlantDiaryDTO dto);

    // 다이어리 삭제
    int deleteDiary(int diaryId);

    // 권한 체크(안전)
    int validateDiaryBelongsToPlant(@Param("userPlantId") int userPlantId,
                                    @Param("diaryId") int diaryId);
}
