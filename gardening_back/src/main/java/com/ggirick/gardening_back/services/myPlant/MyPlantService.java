package com.ggirick.gardening_back.services.myPlant;

import com.ggirick.gardening_back.dto.myPlant.*;
import com.ggirick.gardening_back.dto.myPlant.diary.MyPlantDiaryDTO;
import com.ggirick.gardening_back.dto.myPlant.diary.MyPlantDiaryImageDTO;
import com.ggirick.gardening_back.dto.myPlant.MyPlantImageDTO;
import com.ggirick.gardening_back.dto.myPlant.MyPlantImageResponseDTO;
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

    // 새로운 식물 등록
    @Transactional
    public void insert(MyPlantDTO dto, MultipartFile file, String loginUid) throws Exception {

        // 스크립트/HTML 공격 방지: 제목/내용 이스케이프
        dto.setNickname(HtmlUtils.htmlEscape(dto.getNickname()));
        dto.setMemo(HtmlUtils.htmlEscape(dto.getMemo()));

        // my_plant 테이블에 입력 후 user_plant_id 받기
        myPlantMapper.insert(dto);
        int userPlantId = dto.getUserPlantId();

        // 이미지 파일이 있는 경우에만 업로드 처리
        if (file != null && !file.isEmpty()) {
            // 이미지 DB에 등록
            myPlantImageService.insert(file, userPlantId, loginUid);
        }

        // 메모가 있다면 다이어리에 첫 일지로 등록
        if (dto.getMemo() != null && !dto.getMemo().isBlank()) {
            MyPlantDiaryDTO diaryDTO = MyPlantDiaryDTO.builder()
                    .userPlantId(userPlantId)
                    .content(dto.getMemo())
                    .build();

            myPlantDiaryService.insertDiary(diaryDTO);
        }
    }

    // 식물 정보 수정
    @Transactional
    public void update(MyPlantDTO dto, MultipartFile file) throws  Exception {

        int userPlantId = dto.getUserPlantId();

        // === 이미지 변경 처리 ===
        if (file != null && !file.isEmpty()) { // 새 이미지 업로드 O
            // 기존 대표 이미지 조회
            MyPlantImageDTO oldThumb = myPlantImageService.getThumbnailByPlantId(userPlantId);

            // 1. 이미지 업로드 및 DB 저장 - (중복이면 기존 이미지 정보 반환됨)
            MyPlantImageResponseDTO newThumb = myPlantImageService.insert(file, userPlantId, dto.getUserUid());

            // 2. oldThumb와 newThumb가 서로 다른 이미지일 때만 삭제
            if (oldThumb != null && newThumb != null &&
                    oldThumb.getImageId() != newThumb.getImageId()) {

                myPlantImageService.deleteImage(oldThumb);
            }
        }

        // 등록시 입력한 메모 가져오기
        MyPlantResponseDTO beforeInfo = getByPlantId(userPlantId);

        String beforeMemo = beforeInfo.getMemo(); // 등록시 입력한 메모 내용
        String newMemo = dto.getMemo(); // 수정한 메모 내용

        // 메모 변경 시 다이어리에도 반영 (새 메모가 null/공백 X)
        if (newMemo != null
                && !newMemo.isBlank()
                && !newMemo.equals(beforeMemo)) {

            // 첫번째 다이어리 ID 가져오기 - 없으면 null 반환이라 Integer로 받기
            Integer firstDiaryId = myPlantDiaryService.getFirstDiaryId(userPlantId);

            if (firstDiaryId != null) { // 첫번째 다이어리가 존재한다면
                MyPlantDiaryDTO diaryDTO = MyPlantDiaryDTO.builder()
                        .diaryId(firstDiaryId)
                        .content(newMemo)
                        .build();

                myPlantDiaryService.updateDiary(diaryDTO);
            }
        }

        // 식물 정보 수정
        myPlantMapper.update(dto);
    }

    // 등록한 식물 정보 삭제
    @Transactional
    public void delete(int userPlantId) {
        // 1. 이미지 목록 가져오기
        List<MyPlantDiaryImageDTO> images =
                myPlantDiaryImageService.getImagesForDelete(userPlantId);
        MyPlantImageDTO thumb =
                myPlantImageService.getThumbnailByPlantId(userPlantId);

        // 2. DB 식물 삭제 - fk cascade 설정으로 my_plant_image 테이블 내용도 자동 삭제됨.
        myPlantMapper.delete(userPlantId);

        // 3. 대표이미지 gcp 삭제
        myPlantImageService.deleteImage(thumb);

        // 4. 다이어리 이미지 gcp 삭제
        myPlantDiaryImageService.deleteAllImagesByPlantId(images);
    }

    // 목록 조회 - 이미지 1장
    public List<MyPlantResponseDTO> getListByUserUid(String userUid) {
        return myPlantMapper.getListByUserUid(userUid);
    }

    // 단건 기본정보 조회 (상세 용)
    public MyPlantResponseDTO getByPlantId(int userPlantId) {
        return myPlantMapper.getByPlantId(userPlantId);
    }

    // 권한체크용 userPlantId → ownerUid 조회
    public String getOwnerUidByPlantId(int userPlantId) {
        return myPlantMapper.getOwnerUidByPlantId(userPlantId);
    }
}
