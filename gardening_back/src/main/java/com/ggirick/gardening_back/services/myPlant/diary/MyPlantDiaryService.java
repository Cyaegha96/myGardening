package com.ggirick.gardening_back.services.myPlant.diary;

import com.ggirick.gardening_back.dto.myPlant.diary.MyPlantDiaryDTO;
import com.ggirick.gardening_back.mappers.myPlant.diary.MyPlantDiaryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MyPlantDiaryService {
    private final MyPlantDiaryMapper myPlantDiaryMapper;

    // 단일 조회
    public MyPlantDiaryDTO getDiaryById(int diaryId) {
        return myPlantDiaryMapper.getDiaryById(diaryId);
    }

    // 식물별 다이어리 목록 조회
    public List<MyPlantDiaryDTO> getDiaryByPlantId(int userPlantId) {
        return myPlantDiaryMapper.getDiaryByPlantId(userPlantId);
    }

    // 식물별 첫번째 다이어리 ID 조회 - 가장 오래된 다이어리(없으면 null 반환이라 Integer로 받기)
    public Integer getFirstDiaryId(int userPlantId) {
        return myPlantDiaryMapper.getFirstDiaryId(userPlantId);
    };

    // 다이어리 등록
    public void insertDiary(MyPlantDiaryDTO dto) {
        myPlantDiaryMapper.insertDiary(dto);
    }

    // 다이어리 수정
    public void updateDiary(MyPlantDiaryDTO dto) {
        myPlantDiaryMapper.updateDiary(dto);
    }

    // 다이어리 삭제
    public void deleteDiary(int diaryId) {
        myPlantDiaryMapper.deleteDiary(diaryId);
    }

    // 권한 체크용 - 해당 식물의 diaryId인지
    public int validateDiaryBelongsToPlant(int userPlantId, int diaryId) {
        return myPlantDiaryMapper.validateDiaryBelongsToPlant(userPlantId, diaryId);
    }
}
