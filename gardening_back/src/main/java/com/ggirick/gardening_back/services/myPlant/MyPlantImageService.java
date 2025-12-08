package com.ggirick.gardening_back.services.myPlant;

import com.ggirick.gardening_back.dto.myPlant.MyPlantImageDTO;
import com.ggirick.gardening_back.dto.myPlant.MyPlantImageHistoryDTO;
import com.ggirick.gardening_back.dto.myPlant.MyPlantImageResponseDTO;
import com.ggirick.gardening_back.mappers.myPlant.MyPlantImageMapper;
import com.ggirick.gardening_back.utils.FileUtil;
import com.ggirick.gardening_back.utils.HashUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class MyPlantImageService {

    private final MyPlantImageMapper myPlantImageMapper;
    private final FileUtil fileUtil;

    // 식물의 대표 이미지 조회
    public MyPlantImageDTO getThumbnailByPlantId(int userPlantId) {
        return myPlantImageMapper.getImageByPlantId(userPlantId);
    }

    // 대표 이미지 등록
    @Transactional
    public MyPlantImageResponseDTO insert(MultipartFile file, int userPlantId, String loginUid) throws Exception {

        // 1. 파일 확인
        if (file == null || file.isEmpty()) {
            return null;
        }

        // 2. 해시 생성
        String hash = HashUtil.sha256(file);

        // 3. 기존 이미지 중복 여부 확인
        MyPlantImageDTO exist = myPlantImageMapper.findEntityByHashAndUserUid(hash, loginUid);
        if (exist != null) {
            // 기존 이미지 재활용
            return MyPlantImageResponseDTO.builder()
                    .imageId(exist.getImageId())
                    .url(exist.getUrl())
                    .build();
        }

        // 4. 새로운 파일 업로드
        String folderPath = "my-plant/" + userPlantId + "/";
        Map<String, String> fileInfo = fileUtil.uploadFileAndGetInfo(file.getOriginalFilename(), folderPath, file);

        // 5. DB Insert
        MyPlantImageDTO dto = MyPlantImageDTO.builder()
                .userPlantId(userPlantId)
                .oriName(fileInfo.get("oriName"))
                .sysName(fileInfo.get("sysName"))
                .url(fileInfo.get("url"))
                .hash(hash)
                .build();

        myPlantImageMapper.insert(dto);

        return MyPlantImageResponseDTO.builder()
                .imageId(dto.getImageId())
                .url(dto.getUrl())
                .build();
    }

    // 대표 이미지 변경
    @Transactional
    public void updateThumbnail(int userPlantId, MyPlantImageHistoryDTO img) {

        // 1. DB 업데이트 목적의 DTO 생성
        MyPlantImageDTO dto = MyPlantImageDTO.builder()
                .userPlantId(userPlantId)
                .oriName(img.getOriName())
                .sysName(img.getSysName())
                .url(img.getUrl())
                .hash(img.getHash())
                .build();

        // 2. 대표 이미지 변경
        myPlantImageMapper.updateThumbnail(dto);
    }

    // 대표 이미지 GCP 삭제
    @Transactional
    public void deleteImage(MyPlantImageDTO thumb) {
        if (thumb == null) return;
        fileUtil.deleteFile(thumb.getSysName());
    }

    // 히스토리 이미지 GCP 삭제
    @Transactional
    public void deleteHistoryImageBySysName(String sysName) {
        if (sysName == null || sysName.isBlank()) return;
        fileUtil.deleteFile(sysName);
    }

    // 이미지Id로 대표 이미지 조회
    public MyPlantImageResponseDTO getImageById(int imageId) {
        return myPlantImageMapper.getImageById(imageId);
    }

    // 권한 체크용 - 식물 등록자 UID 조회
    public String getOwnerUidByPlantImageId(int imageId) {
        return myPlantImageMapper.getOwnerUidByPlantImageId(imageId);
    }

    // 권한 체크용 - 해당 식물 이미지인지 검증
    public int validateImageBelongsToPlant(int imageId, int userPlantId) {
        return myPlantImageMapper.validateImageBelongsToPlant(imageId, userPlantId);
    }
}
