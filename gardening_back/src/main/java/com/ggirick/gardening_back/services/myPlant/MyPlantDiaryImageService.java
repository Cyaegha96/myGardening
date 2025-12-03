package com.ggirick.gardening_back.services.myPlant;

import com.ggirick.gardening_back.dto.myPlant.MyPlantDiaryImageDTO;
import com.ggirick.gardening_back.dto.myPlant.MyPlantDiaryImageResponseDTO;
import com.ggirick.gardening_back.mappers.myPlant.MyPlantDiaryImageMapper;
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

    // 다이어리별 이미지 목록 조회
    public List<MyPlantDiaryImageDTO> getImagesByPlantId(int userPlantId) {
        return myPlantDiaryImageMapper.getImageByPlantId(userPlantId);
    }

    // 개별 이미지 조회
    public MyPlantDiaryImageDTO getImageById(int imageId) {
        return myPlantDiaryImageMapper.getImageById(imageId);
    }

    // 이미지 개별 삭제
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

    // 다이어리 삭제 → 모든 이미지 삭제
    @Transactional
    public void deleteByDiaryId(int diaryId) {
        List<MyPlantDiaryImageDTO> images =
                myPlantDiaryImageMapper.getImageByPlantId(diaryId);

        // DB 삭제
        myPlantDiaryImageMapper.deleteByDiaryId(diaryId);

        // 먼저 파일 삭제
        for (MyPlantDiaryImageDTO img : images) {
            fileUtil.deleteFile(img.getSysName());
        }
    }
}
