package com.ggirick.gardening_back.services.myPlant.diary;

import com.ggirick.gardening_back.dto.myPlant.diary.MyPlantDiaryImageDTO;
import com.ggirick.gardening_back.dto.myPlant.diary.MyPlantDiaryImageResponseDTO;
import com.ggirick.gardening_back.mappers.myPlant.diary.MyPlantDiaryImageMapper;
import com.ggirick.gardening_back.utils.FileUtil;
import com.ggirick.gardening_back.utils.HashUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MyPlantDiaryImageService {
    private final MyPlantDiaryImageMapper myPlantDiaryImageMapper;
    private final FileUtil fileUtil;

    // 다이어리 이미지 등록
    @Transactional
    public MyPlantDiaryImageResponseDTO insert(MultipartFile file, int diaryId,
                                                int userPlantId, String loginUid) throws Exception {
        // 파일이 비어있으면 리턴
        if (file == null || file.isEmpty()) {
            return null;
        }

        // 1. Hash 생성
        String hash = HashUtil.sha256(file);

        // 2. 유저 전체 식물 기준 이미지 중복 체크
        MyPlantDiaryImageResponseDTO exist =
                myPlantDiaryImageMapper.findByHashAndUserUid(hash, loginUid);

        if (exist != null) {
            // 기존 이미지 재사용
            return exist;
        }

        // 3. GCP 업로드 (등록식물/고유번호/다이어리/다이어리고유번호)
        String folderPath = "my-plant/" + userPlantId + "/diary/" + diaryId + "/";

        Map<String, String> fileInfo =
                fileUtil.uploadFileAndGetInfo(file.getOriginalFilename(), folderPath, file);

        // 4. DB 저장
        MyPlantDiaryImageDTO dto = MyPlantDiaryImageDTO.builder()
                .diaryId(diaryId)
                .oriName(fileInfo.get("oriName"))
                .sysName(fileInfo.get("sysName"))
                .url(fileInfo.get("url"))
                .hash(hash)
                .build();

        myPlantDiaryImageMapper.insert(dto);

        // 5. 신규 이미지 ResponseDTO 반환
        return MyPlantDiaryImageResponseDTO.builder()
                .imageId(dto.getImageId())
                .url(dto.getUrl())
                .build();
    }

    // 식물별 다이어리 이미지 목록 조회
    public List<MyPlantDiaryImageResponseDTO> getImagesByPlantId(int userPlantId) {
        List<MyPlantDiaryImageDTO> images = myPlantDiaryImageMapper.getImagesByPlantId(userPlantId);
        return MyPlantDiaryImageResponseDTO.ofList(images);
    }

    // 개별 이미지 조회 - imageId 기준
    public MyPlantDiaryImageResponseDTO getImageById(int imageId) {
        return MyPlantDiaryImageResponseDTO.of(myPlantDiaryImageMapper.getImageById(imageId));
    }

    // 다이어리별 이미지 단건 조회 (1:1 관계 보장) - diaryId 기준
    public MyPlantDiaryImageDTO getImageByDiaryId(int diaryId) {
        return myPlantDiaryImageMapper.getImageByDiaryId(diaryId);
    }

    // imageId로 이미지 개별 삭제
    @Transactional
    public void deleteByImageId(int imageId) {
        // imageId로 삭제할 대표이미지 정보 가져오기
        MyPlantDiaryImageDTO dto = myPlantDiaryImageMapper.getImageById(imageId);
        if (dto == null) return;

        // 1. DB 삭제
        myPlantDiaryImageMapper.deleteByImageId(imageId);

        // 2. GCP 삭제
        fileUtil.deleteFile(dto.getSysName());
    }

    // 삭제하기 위한 list
     public List<MyPlantDiaryImageDTO> getImagesForDelete(int userPlantId) {
        return myPlantDiaryImageMapper.getImagesByPlantId(userPlantId);
    }

    // 등록한 식물 삭제 → 모든 다이어리 삭제 -> 모든 이미지 삭제
    @Transactional
    public void deleteAllImagesByPlantId(List<MyPlantDiaryImageDTO> images) {
         // gcp 파일 삭제 & DB 삭제
        for (MyPlantDiaryImageDTO img : images) {
            // myPlantDiaryImageMapper.deleteByDiaryId(diaryId);
            fileUtil.deleteFile(img.getSysName());
        }
    }

    // 권한 체크용 - 해당 식물의 이미지인지
    public int validateDiaryImageBelongsToPlant(int imageId, int userPlantId) {
        return myPlantDiaryImageMapper.validateDiaryImageBelongsToPlant(imageId, userPlantId);
    }
}
