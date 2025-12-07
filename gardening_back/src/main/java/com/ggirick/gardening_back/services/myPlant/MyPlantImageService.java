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

    // 등록한 식물의 대표 이미지 조회
    public MyPlantImageDTO getThumbnailByPlantId(int userPlantId) {
        return myPlantImageMapper.getThumbnailByPlantId(userPlantId);
    }

    // imageId로 대표 이미지 조회
    public MyPlantImageResponseDTO getImageById(int imageId) {
        return myPlantImageMapper.getImageById(imageId);
    }

    // 이미지 등록
    @Transactional
    public MyPlantImageResponseDTO insert(MultipartFile file, int userPlantId, String loginUid) throws Exception {
        // 파일이 비어있으면 리턴
        if (file == null || file.isEmpty()) {
            return null;
        }

        // 원본 파일명
        String oriName = file.getOriginalFilename();

        // 1. hash 생성
        String hash = HashUtil.sha256(file);

        // 2. 유저 전체 식물 기준 이미지 중복 체크
        MyPlantImageResponseDTO exist = myPlantImageMapper.findByHashAndUserUid(hash, loginUid);
        if (exist != null) {
            // 이미 같은 사진이 존재하면 → 업로드 스킵하고 재사용
            return exist;
        }

        // 파일 경로
        String folderPath = ("my-plant/" + userPlantId + "/");

        // 3. GCP 업로드 후 sysName, publicUrl 반환
        Map<String, String> fileInfo = fileUtil.uploadFileAndGetInfo(oriName, folderPath, file);


        // 4. DB에 업로드
        MyPlantImageDTO dto = MyPlantImageDTO.builder()
                .userPlantId(userPlantId)
                .oriName(fileInfo.get("oriName"))
                .sysName(fileInfo.get("sysName"))
                .url(fileInfo.get("url"))
                .hash(hash)
                .build();

        myPlantImageMapper.insert(dto);

        // 5. 신규 이미지 ResponseDTO 반환
        return MyPlantImageResponseDTO.builder()
                .imageId(dto.getImageId())  // selectKey에서 채워진 PK
                .url(dto.getUrl())
                .build();
    }

    // 대표 이미지 삭제
    @Transactional
    public void deleteImage(MyPlantImageDTO thumb) {
        if (thumb == null) return; // 이미 삭제되었거나 없음

        // 1. DB 삭제 - fk cascade 설정으로 생략
//        myPlantImageMapper.delete(imageId);

        // 2. gcp 삭제
        fileUtil.deleteFile(thumb.getSysName());
    }

    // 히스토리 이미지 전용 - GCP 삭제 (DB는 다른 계층에서)
    @Transactional
    public void deleteHistoryImageBySysName(String sysName) {
        if (sysName == null || sysName.isBlank()) return;
        fileUtil.deleteFile(sysName);
    }


    // 권한 체크용 - 식물 등록자가 맞는지
    public String getOwnerUidByPlantImageId(int imageId) {
        return myPlantImageMapper.getOwnerUidByPlantImageId(imageId);
    }

    // 권한 체크용 - 해당 식물의 이미지인지
    public int validateImageBelongsToPlant(int imageId, int userPlantId) {
        return myPlantImageMapper.validateImageBelongsToPlant(imageId, userPlantId);
    }

    // 대표 이미지 변경
    @Transactional
    public void updateThumbnail(int userPlantId, MyPlantImageHistoryDTO img) {

        MyPlantImageDTO dto = MyPlantImageDTO.builder()
                .userPlantId(userPlantId)
                .oriName(img.getOriName())
                .sysName(img.getSysName())
                .url(img.getUrl())
                .hash(img.getHash())
                .build();

        myPlantImageMapper.updateThumbnail(dto);
    }

}


