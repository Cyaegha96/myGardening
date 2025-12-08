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

        // 3. 대표 이미지 등록
        if (file != null && !file.isEmpty()) {
            myPlantImageService.insert(file, userPlantId, loginUid);
            // 처음 등록된 대표 이미지는 history에 넣지 않음
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

        if (file != null && !file.isEmpty()) {

            // 1. 현재 대표 이미지 조회
            MyPlantImageDTO currentThumb = myPlantImageService.getThumbnailByPlantId(userPlantId);

            // 2. 신규 업로드 또는 기존 이미지 확인
            MyPlantImageResponseDTO saved = myPlantImageService.insert(file, userPlantId, loginUid);
            MyPlantImageDTO newThumb = myPlantImageService.getThumbnailByPlantId(userPlantId);

            // 3. 기존 대표 있고, 다른 이미지면 히스토리 백업
            if (currentThumb != null &&
                    newThumb != null &&
                    !currentThumb.getHash().equals(newThumb.getHash())) {

                historyService.backupImage(currentThumb);
            }

            // 4. 대표 이미지 갱신
            if (newThumb != null) {
                MyPlantImageHistoryDTO historyDto = MyPlantImageHistoryDTO.builder()
                        .userPlantId(userPlantId)
                        .oriName(newThumb.getOriName())
                        .sysName(newThumb.getSysName())
                        .url(newThumb.getUrl())
                        .hash(newThumb.getHash())
                        .build();

                myPlantImageService.updateThumbnail(userPlantId, historyDto);
            }
        }

        // 5. 식물 정보 수정
        myPlantMapper.update(dto);
    }

    // 식물 삭제
    @Transactional
    public void delete(int userPlantId) {

        // 1. 삭제할 이미지 조회
        List<MyPlantDiaryImageDTO> imagesForDelete =
                myPlantDiaryImageService.getImagesForDelete(userPlantId);
        MyPlantImageDTO thumbnail =
                myPlantImageService.getThumbnailByPlantId(userPlantId);

        // 2. DB 삭제
        myPlantMapper.delete(userPlantId);

        // 3. GCP 삭제 처리
        myPlantImageService.deleteImage(thumbnail);
        myPlantDiaryImageService.deleteAllImagesByPlantId(imagesForDelete);
    }

    public List<MyPlantResponseDTO> getListByUserUid(String userUid) {
        return myPlantMapper.getListByUserUid(userUid);
    }

    public MyPlantResponseDTO getByPlantId(int userPlantId) {
        return myPlantMapper.getByPlantId(userPlantId);
    }

    public String getOwnerUidByPlantId(int userPlantId) {
        return myPlantMapper.getOwnerUidByPlantId(userPlantId);
    }
}
