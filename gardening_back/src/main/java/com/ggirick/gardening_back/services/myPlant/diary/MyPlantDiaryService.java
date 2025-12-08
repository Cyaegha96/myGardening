package com.ggirick.gardening_back.services.myPlant.diary;

import com.ggirick.gardening_back.dto.myPlant.diary.MyPlantDiaryDTO;
import com.ggirick.gardening_back.dto.myPlant.diary.MyPlantDiaryImageDTO;
import com.ggirick.gardening_back.dto.myPlant.diary.MyPlantDiaryResponseDTO;
import com.ggirick.gardening_back.mappers.myPlant.diary.MyPlantDiaryMapper;
import com.ggirick.gardening_back.utils.HashUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MyPlantDiaryService {

    private final MyPlantDiaryMapper diaryMapper;
    private final MyPlantDiaryImageService diaryImageService;

    // 단일 조회
    public MyPlantDiaryDTO getDiaryById(int diaryId) {
        return diaryMapper.getDiaryById(diaryId);
    }

    // 식물별 다이어리 목록 조회
    @Transactional(readOnly = true)
    public List<MyPlantDiaryResponseDTO> getDiaryList(int userPlantId) {
        return diaryMapper.getDiaryListByUserPlantId(userPlantId);
    }

    // 식물별 첫번째(가장 오래된) diaryId 조회 - 사용자 스크롤 시작점 용도
    public Integer getFirstDiaryId(int userPlantId) {
        return diaryMapper.getFirstDiaryId(userPlantId);
    }

    // 다이어리 등록 (텍스트 + 이미지)
    @Transactional
    public void insertDiary(MyPlantDiaryDTO dto, MultipartFile file, String loginUid) throws Exception {

        // 텍스트 저장 (PK 생성)
        diaryMapper.insertDiary(dto);
        int diaryId = dto.getDiaryId();

        // 선택 이미지 있을 경우 업로드
        if (file != null && !file.isEmpty()) {
            diaryImageService.insert(file, diaryId, dto.getUserPlantId(), loginUid);
        }
    }

    // 다이어리 수정
    @Transactional
    public void updateDiary(MyPlantDiaryDTO dto, MultipartFile file, String loginUid) throws Exception {

        // 텍스트 수정
        diaryMapper.updateDiary(dto);

        // 기존 이미지 조회
        MyPlantDiaryImageDTO oldImage = diaryImageService.getImageByDiaryId(dto.getDiaryId());

        // 기존 이미지 없음 → 신규 업로드만
        if (oldImage == null) {
            if (file != null && !file.isEmpty()) {
                diaryImageService.insert(file, dto.getDiaryId(), dto.getUserPlantId(), loginUid);
            }
            return;
        }

        // 기존 이미지 있음
        if (file == null || file.isEmpty()) {
            // 클라이언트에서 이미지를 제거한 상태
            diaryImageService.deleteByImageId(oldImage.getImageId());
            return;
        }

        // 새 파일 hash 검사 (동일 파일인지 체크)
        String newHash = HashUtil.sha256(file);
        if (newHash.equals(oldImage.getHash())) {
            // 동일 이미지 → 변경 없이 종료
            return;
        }

        // 이미지 교체 처리
        diaryImageService.deleteByImageId(oldImage.getImageId());
        diaryImageService.insert(file, dto.getDiaryId(), dto.getUserPlantId(), loginUid);
    }

    // 다이어리 삭제 (이미지 CASCADE 설정된 경우 자동 삭제)
    @Transactional
    public void deleteDiary(int diaryId) {
        diaryMapper.deleteDiary(diaryId);
    }

    // 권한 체크 - 해당 diaryId가 userPlantId에 속하는지 검사
    public int validateDiaryBelongsToPlant(int userPlantId, int diaryId) {
        return diaryMapper.validateDiaryBelongsToPlant(userPlantId, diaryId);
    }
}
