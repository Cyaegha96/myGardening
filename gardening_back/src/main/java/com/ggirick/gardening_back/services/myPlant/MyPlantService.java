package com.ggirick.gardening_back.services.myPlant;

import com.ggirick.gardening_back.dto.myPlant.*;
import com.ggirick.gardening_back.dto.myPlant.diary.MyPlantDiaryDTO;
import com.ggirick.gardening_back.dto.myPlant.diary.MyPlantDiaryImageDTO;
import com.ggirick.gardening_back.mappers.myPlant.MyPlantMapper;
import com.ggirick.gardening_back.services.myPlant.diary.MyPlantDiaryImageService;
import com.ggirick.gardening_back.services.myPlant.diary.MyPlantDiaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.HtmlUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MyPlantService {

    private final MyPlantMapper myPlantMapper;
    private final MyPlantImageService myPlantImageService;
    private final MyPlantDiaryService myPlantDiaryService;
    private final MyPlantDiaryImageService myPlantDiaryImageService;
    private final MyPlantImageHistoryService historyService;

    // 식물 등록
    @Transactional
    public void insert(MyPlantDTO dto, MultipartFile file, String loginUid) throws Exception {

        // 1. 스크립트/HTML 공격 방지: 제목/내용 이스케이프
        if (dto.getNickname() != null && !dto.getNickname().isBlank()) {
            dto.setNickname(HtmlUtils.htmlEscape(dto.getNickname()));
        } else {
            dto.setNickname(null);
        }
        if (dto.getMemo() != null) {
            dto.setMemo(HtmlUtils.htmlEscape(dto.getMemo()));
        }

        // 2. 식물 DB 등록 및 userPlantId 획득
        myPlantMapper.insert(dto);
        int userPlantId = dto.getUserPlantId();

        // 3. 이미지 등록 시 → 대표이미지 & 히스토리 등록
        if (file != null && !file.isEmpty()) {
            myPlantImageService.insert(file, userPlantId, loginUid);

            MyPlantImageDTO thumb = myPlantImageService.getThumbnailByPlantId(userPlantId);
            historyService.backupImage(thumb);
        }

        // 4. 메모 존재 시 첫 일지 자동 등록
        if (dto.getMemo() != null && !dto.getMemo().isBlank()) {
            MyPlantDiaryDTO diaryDTO = MyPlantDiaryDTO.builder()
                    .userPlantId(userPlantId)
                    .content(dto.getMemo())
                    .build();
            myPlantDiaryService.insertDiary(diaryDTO, null, loginUid);
        }
    }

    // 식물 정보 수정
    @Transactional
    public void update(MyPlantDTO dto, MultipartFile file, String loginUid) throws Exception {

        int userPlantId = dto.getUserPlantId();

        // 1. 기존 대표 이미지 조회
        MyPlantImageDTO oldThumb =
                myPlantImageService.getThumbnailByPlantId(userPlantId);

        // 2. 신규 이미지 업로드 시 처리
        if (file != null && !file.isEmpty()) {
            // 1) 이미지 업로드
            myPlantImageService.insert(file, userPlantId, loginUid);

            // 2) 업로드 후 대표 이미지 재조회
            MyPlantImageDTO newThumb = myPlantImageService.getThumbnailByPlantId(userPlantId);

            // 3) 기존 대표이미지와 hash 비교 후 히스토리 백업
            if (oldThumb != null &&
                    newThumb != null &&
                    !newThumb.getHash().equals(oldThumb.getHash())) {

                // 기존 대표이미지가 새 이미지와 다를 때만 백업
                historyService.backupImage(oldThumb);
            }
        }

        // 3. DB 수정
        myPlantMapper.update(dto);
    }

    // 식물 삭제
    @Transactional
    public void delete(int userPlantId) {

        // 1. GCP 삭제 대상 조회
        List<MyPlantDiaryImageDTO> imagesForDelete =
                myPlantDiaryImageService.getImagesForDelete(userPlantId);
        MyPlantImageDTO thumbnail =
                myPlantImageService.getThumbnailByPlantId(userPlantId);

        // 2. DB 삭제 (Cascade 적용)
        myPlantMapper.delete(userPlantId);

        // 3. 대표 이미지 GCP 삭제
        myPlantImageService.deleteImage(thumbnail);

        // 4. 다이어리 이미지 GCP 삭제
        myPlantDiaryImageService.deleteAllImagesByPlantId(imagesForDelete);
    }

    // 식물 목록 조회
    public List<MyPlantResponseDTO> getListByUserUid(String userUid) {
        return myPlantMapper.getListByUserUid(userUid);
    }

    // 식물 단건 조회
    public MyPlantResponseDTO getByPlantId(int userPlantId) {
        return myPlantMapper.getByPlantId(userPlantId);
    }

    // 권한 체크용
    public String getOwnerUidByPlantId(int userPlantId) {
        return myPlantMapper.getOwnerUidByPlantId(userPlantId);
    }
}
