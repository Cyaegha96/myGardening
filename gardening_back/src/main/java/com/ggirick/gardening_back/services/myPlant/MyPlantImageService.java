package com.ggirick.gardening_back.services.myPlant;

import com.ggirick.gardening_back.dto.myPlant.MyPlantImageDTO;
import com.ggirick.gardening_back.dto.myPlant.MyPlantImageHistoryDTO;
import com.ggirick.gardening_back.dto.myPlant.MyPlantImageHistoryResponseDTO;
import com.ggirick.gardening_back.dto.myPlant.MyPlantImageResponseDTO;
import com.ggirick.gardening_back.mappers.myPlant.MyPlantImageHistoryMapper;
import com.ggirick.gardening_back.mappers.myPlant.MyPlantImageMapper;
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
public class MyPlantImageService { // 대표이미지 + 히스토리 관리
    // 최대 저장 가능한 히스토리 개수
    private static final int MAX_HISTORY_COUNT = 3;

    private final MyPlantImageMapper myPlantImageMapper;
    private final MyPlantImageHistoryMapper historyMapper;
    private final FileUtil fileUtil;
    private final ImageStorageService imageStorageService;

    // 대표 이미지 등록
    @Transactional
    public void insert(MultipartFile file, int userPlantId) throws Exception {

        // 1. 파일 확인
        if (file == null || file.isEmpty()) {
            return;
        }

        // 2. 해시 생성
        String hash = HashUtil.sha256(file);

        // 3. 기존 이미지 중복 여부 확인
        MyPlantImageDTO exist = imageStorageService.findEntityByHash(hash);

        // 3-1. 중복이라면 재활용
        if (exist != null) {
            // 기존 이미지 재활용
            MyPlantImageDTO reused = MyPlantImageDTO.builder()
                    .userPlantId(userPlantId)
                    .oriName(exist.getOriName())
                    .sysName(exist.getSysName())
                    .url(exist.getUrl())
                    .hash(exist.getHash())
                    .build();
            myPlantImageMapper.insert(reused);
            // 히스토리에 저장
            backupImage(reused);
            return;
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

        // 7. 히스토리에 저장
        backupImage(dto);
    }

    // 대표 이미지 변경
    @Transactional
    public void update(MultipartFile file, int userPlantId) throws Exception {
        // 1. 해쉬 생성
        String hash = HashUtil.sha256(file);

        // 2. 기존 대표 이미지 정보 가져오기
        MyPlantImageDTO beforeThumb = getThumbnailByPlantId(userPlantId);

        // 3. 기존 대표 이미지와 다른 이미지인지 비교
        if (beforeThumb.getHash().equals(hash)) { // 해쉬 값이 같으면
            return;
        }

        // 4. 업데이트 전 이미지 중복 검사
        MyPlantImageDTO exist = imageStorageService.findEntityByHash(hash);

        // 4-1. 중복될 경우 재활용
        if (exist != null) {
            // 기존 이미지 재활용
            MyPlantImageDTO reused = MyPlantImageDTO.builder()
                    .imageId(beforeThumb.getImageId()) // 기존 PK 유지
                    .userPlantId(userPlantId)
                    .oriName(exist.getOriName())
                    .sysName(exist.getSysName())
                    .url(exist.getUrl())
                    .hash(exist.getHash())
                    .build();
            myPlantImageMapper.update(reused);
            // 히스토리에도 백업
            backupImage(reused);
            return;
        }

        // 5. 업데이트 -> GCP 업로드 후 sysName 담아오기
        String folderPath = "my-plant/" + userPlantId + "/";
        Map<String, String> fileInfo = fileUtil.uploadFileAndGetInfo(file.getOriginalFilename(), folderPath, file);

        MyPlantImageDTO newThumb = MyPlantImageDTO.builder()
                .imageId(beforeThumb.getImageId())
                .oriName(fileInfo.get("oriName"))
                .sysName(fileInfo.get("sysName"))
                .url(fileInfo.get("url"))
                .hash(hash)
                .build();
        myPlantImageMapper.update(newThumb);

        // 6. 히스토리에도 백업
        backupImage(newThumb);
    }

    // 대표 이미지 변경 - 히스토리에서 승격
    @Transactional
    public void updateFromHistory(int userPlantId, int imageHistoryId) {
        // 1. 현재 대표 이미지 조회
        MyPlantImageDTO currentThumb = myPlantImageMapper.getImageByPlantId(userPlantId);

        // 2. 변경할 히스토리 이미지 조회
        MyPlantImageHistoryDTO history = getHistoryById(imageHistoryId);

        // 2. 같은 이미지면 변경 불필요
        if (currentThumb.getHash().equals(history.getHash())) {
            return;
        }

        // 3. 대표 이미지 내용을 히스토리 이미지 값으로 갈아끼움 (PK 유지)
        MyPlantImageDTO updated = MyPlantImageDTO.builder()
                .imageId(currentThumb.getImageId())   // PK 유지
                .userPlantId(userPlantId)
                .oriName(history.getOriName())
                .sysName(history.getSysName())
                .url(history.getUrl())
                .hash(history.getHash())
                .build();
        // 대표이미지 DB 업데이트
        myPlantImageMapper.update(updated);
        // 히스토리 업데이트
        backupImage(updated);
    }

    // 이미지Id로 대표 이미지 조회
    public MyPlantImageResponseDTO getImageById(int imageId) {
        return myPlantImageMapper.getImageById(imageId);
    }

    // 대표 이미지 백업 → 히스토리 최신으로 저장
    @Transactional
    public void backupImage(MyPlantImageDTO img) {
        if (img == null) return;

        // 1. 최신으로 히스토리 저장
        historyMapper.insert(MyPlantImageHistoryDTO.builder()
                .userPlantId(img.getUserPlantId())
                .oriName(img.getOriName())
                .sysName(img.getSysName())
                .url(img.getUrl())
                .hash(img.getHash())
                .build()
        );

        // 2. 먼저 기존에 있던 히스토리 삭제
        historyMapper.deleteByHash(img.getHash());

        // 3. 히스토리 3개 초과분 삭제
        trimHistory(img.getUserPlantId());
    }

    // ==================== 조회 모음 ====================
    // 식물의 대표 이미지 조회
    public MyPlantImageDTO getThumbnailByPlantId(int userPlantId) {
        return myPlantImageMapper.getImageByPlantId(userPlantId);
    }

    // 클라이언트 응답용 히스토리 전체 조회
    public List<MyPlantImageHistoryResponseDTO> getHistoryForResponse(int userPlantId) {
        List<MyPlantImageHistoryDTO> list = historyMapper.getHistoryList(userPlantId);
        return MyPlantImageHistoryResponseDTO.ofList(list);
    }

    // 내부 조회용 히스토리 전체 조회
    public List<MyPlantImageHistoryDTO> getHistoryForEntity(int userPlantId) {
        return historyMapper.getHistoryList(userPlantId);
    }

    // 히스토리 단건 조회
    public MyPlantImageHistoryDTO getHistoryById(int historyId) {
        return historyMapper.getHistoryById(historyId);
    }

    // ==================== GCP 삭제 모음 ====================
    // 대표 이미지 GCP 삭제 = 등록한 식물 자체가 삭제된 것.
    @Transactional
    public void deleteImage(int userPlantId) {
        // 1. 삭제할 이미지 조회
        MyPlantImageDTO thumb = getThumbnailByPlantId(userPlantId);
        if (thumb == null) return;

        // 2. 대표이미지 GCP 삭제 처리
        int count = imageStorageService.countByHash(thumb.getHash());
        if (count == 1) {
            imageStorageService.deleteFile(thumb.getSysName());
        }

        // 3. 히스토리 전체 삭제
        deleteHistoryAllImages(userPlantId);
    }

    // 히스토리 이미지 1건 삭제
    @Transactional
    public void deleteHistoryImage(int userPlantId) {
        // 1. 삭제할 오래된 히스토리 조회
        MyPlantImageHistoryDTO oldest = historyMapper.getOldest(userPlantId);

        // 2. 없으면 동작 안 함
        if (oldest == null) return;

        // 3. 있으면 DB 삭제
        historyMapper.deleteByHistoryId(oldest.getImageHistoryId());

        // 4. GCP 삭제
        int count = imageStorageService.countByHash(oldest.getHash());
        if (count == 1) {
            imageStorageService.deleteFile(oldest.getSysName());
        }
    }

    // 히스토리 이미지 GCP 전체 삭제
    @Transactional
    public void deleteHistoryAllImages(int userPlantId) {
        // 1. 삭제할 히스토리 목록 조회
        List<MyPlantImageHistoryDTO> histories =  historyMapper.getHistoryList(userPlantId);

        // 2. GCP 삭제 처리
        for (MyPlantImageHistoryDTO history : histories) {
            int count = imageStorageService.countByHash(history.getHash());
            if (count == 1) {
                imageStorageService.deleteFile(history.getSysName());
            }
        }
    }

    // 히스토리 개수 정리
    private void trimHistory(int userPlantId) {
        // 1. 히스토리 개수 조회
        int count = historyMapper.getCountByPlantId(userPlantId);
        // 2. 3개 이하면 정리 X
        if (count <= MAX_HISTORY_COUNT) return;

        // 3. 3개 초과면 제일 오래된 히스토리 1건 삭제
        deleteHistoryImage(userPlantId);
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
