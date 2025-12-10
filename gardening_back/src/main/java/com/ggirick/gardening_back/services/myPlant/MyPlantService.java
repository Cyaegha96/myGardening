package com.ggirick.gardening_back.services.myPlant;

import com.ggirick.gardening_back.dto.myPlant.MyPlantDTO;
import com.ggirick.gardening_back.dto.myPlant.MyPlantImageDTO;
import com.ggirick.gardening_back.dto.myPlant.MyPlantImageHistoryDTO;
import com.ggirick.gardening_back.dto.myPlant.MyPlantResponseDTO;
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

    // 식물 등록
    @Transactional
    public void insert(MyPlantDTO dto, MultipartFile file, String loginUid) throws Exception {

        // 1. XSS 방지
        if (dto.getNickname() != null && !dto.getNickname().isBlank()) {
            dto.setNickname(HtmlUtils.htmlEscape(dto.getNickname()));
        } else {
            dto.setNickname(null);
        }
        if (dto.getMemo() != null) {
            dto.setMemo(HtmlUtils.htmlEscape(dto.getMemo()));
        }

        // 2. 식물 등록
        myPlantMapper.insert(dto);
        int userPlantId = dto.getUserPlantId();

        // 3. 대표 이미지 + 히스토리 등록
        if (file != null && !file.isEmpty()) {
           myPlantImageService.insert(file, userPlantId);
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
    public void update(MyPlantDTO dto, MultipartFile file) throws Exception {

        if (file != null && !file.isEmpty()) {
            // 1. 대표이미지 수정 + 히스토리 백업
            myPlantImageService.update(file, dto.getUserPlantId());
        }
        // 2. 식물 정보 수정
        myPlantMapper.update(dto);
    }

    // 식물 삭제
    @Transactional
    public void delete(int userPlantId) {
        // 1. DB 삭제
        myPlantMapper.delete(userPlantId);

        // 2. GCP 삭제 처리 - 각 이미지 서비스로 넘기기
        myPlantImageService.deleteImage(userPlantId);
        myPlantDiaryImageService.deleteAllImages(userPlantId);
    }

    // 등록한 내 식물 모두 조회
    public List<MyPlantResponseDTO> getListByUserUid(String userUid) {
        return myPlantMapper.getListByUserUid(userUid);
    }

    // 단건 기본정보 조회 (상세 용)
    public MyPlantResponseDTO getByPlantId(int userPlantId) {
        return myPlantMapper.getByPlantId(userPlantId);
    }

    // 권한 체크 - userPlantId → ownerUid 조회
    public String getOwnerUidByPlantId(int userPlantId) {
        return myPlantMapper.getOwnerUidByPlantId(userPlantId);
    }
}
