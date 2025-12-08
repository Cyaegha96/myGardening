package com.ggirick.gardening_back.services.myPlant.diary;

import com.ggirick.gardening_back.dto.myPlant.MyPlantImageDTO;
import com.ggirick.gardening_back.dto.myPlant.diary.MyPlantDiaryImageDTO;
import com.ggirick.gardening_back.dto.myPlant.diary.MyPlantDiaryImageResponseDTO;
import com.ggirick.gardening_back.mappers.myPlant.diary.MyPlantDiaryImageMapper;
import com.ggirick.gardening_back.services.myPlant.ImageStorageService;
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
    private final ImageStorageService imageStorageService;

    // 다이어리 이미지 등록
    @Transactional
    public MyPlantDiaryImageDTO insert(MultipartFile file, int diaryId,
                                       int userPlantId) throws Exception {
        // 파일이 비어있으면 리턴
        if (file == null || file.isEmpty()) {
            return null;
        }

        // 1. Hash 생성
        String hash = HashUtil.sha256(file);

        // 2. 유저 전체 식물 기준 이미지 중복 체크
        MyPlantImageDTO exist =
                imageStorageService.findEntityByHash(hash);

        // 2-1. 중복 이미지가 있다면
        if (exist != null) {
            // 기존 이미지 재사용
            MyPlantDiaryImageDTO reused = MyPlantDiaryImageDTO.builder()
                    .diaryId(diaryId)
                    .oriName(exist.getOriName())
                    .sysName(exist.getSysName())
                    .url(exist.getUrl())
                    .hash(exist.getHash())
                    .build();
            myPlantDiaryImageMapper.insert(reused);
            // imageId 채워서 리턴
            return reused;
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

        // 5. 신규 이미지 DTO 반환
        return dto;
    }

    // 다이어리 이미지 수정
    @Transactional
    public void update(MultipartFile file, int userPlantId, int diaryId) throws Exception {
        // 1. 기존 이미지 조회
        MyPlantDiaryImageDTO oldImage = myPlantDiaryImageMapper.getImageByDiaryId(diaryId);

        // 2. 새로운 파일이 있는지 확인
        boolean hasNewFile = (file != null && !file.isEmpty());

        // CASE A: 기존 이미지 있고, 새 파일 없음 → 기존 이미지 삭제
        if (oldImage != null && !hasNewFile) {
            deleteByImageId(oldImage.getImageId());
            return;
        }

        // CASE B: 기존 이미지 없고, 새 파일 있음 → 새 이미지 insert
        if (oldImage == null && hasNewFile) {
            insert(file, diaryId, userPlantId);
            return;
        }

        // CASE C: 기존 이미지 O + 새 파일 O → 변경 여부 판단
        if (oldImage != null && hasNewFile) {

            String newHash = HashUtil.sha256(file);

            // C-1: 동일 파일이면 아무 작업 안 함
            if (newHash.equals(oldImage.getHash())) {
                return;
            }

            // 다른 이미지라면 기존 이미지 gcp에서 삭제
            int count = imageStorageService.countByHash(oldImage.getHash());
            if (count == 1) {
                imageStorageService.deleteFile(oldImage.getSysName());
            }

            // 중복 이미지 재활용 체크
            MyPlantImageDTO exist = imageStorageService.findEntityByHash(newHash);
            if (exist != null) { // 중복이미지가 있다면
                // PK 유지하여 update
                MyPlantDiaryImageDTO reused = MyPlantDiaryImageDTO.builder()
                        .imageId(oldImage.getImageId())
                        .diaryId(diaryId)
                        .oriName(exist.getOriName())
                        .sysName(exist.getSysName())
                        .url(exist.getUrl())
                        .hash(exist.getHash())
                        .build();
                myPlantDiaryImageMapper.update(reused);
                return;
            }

            // 중복 없으면 새 업로드 후 update
            String folderPath = "my-plant/" + userPlantId + "/diary/" + diaryId + "/";
            Map<String, String> fileInfo = fileUtil.uploadFileAndGetInfo(file.getOriginalFilename(), folderPath, file);

            MyPlantDiaryImageDTO updated = MyPlantDiaryImageDTO.builder()
                    .imageId(oldImage.getImageId())
                    .diaryId(diaryId)
                    .oriName(fileInfo.get("oriName"))
                    .sysName(fileInfo.get("sysName"))
                    .url(fileInfo.get("url"))
                    .hash(newHash)
                    .build();

            myPlantDiaryImageMapper.update(updated);
        }

        // CASE D: 기존 이미지 X + 새 파일 X → 아무 행동 없음
    }

    // 식물별 다이어리 이미지 목록 조회 - 클라이언트용
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

        // 2. 참조 개수 확인 → GCP 삭제 여부 판단
        int count = imageStorageService.countByHash(dto.getHash());
        if (count == 1) {
            imageStorageService.deleteFile(dto.getSysName());
        }
    }

    // 삭제하기 위한 list
    public List<MyPlantDiaryImageDTO> getImagesForDelete(int userPlantId) {
        return myPlantDiaryImageMapper.getImagesByPlantId(userPlantId);
    }

    // 등록한 식물 삭제 → 모든 다이어리 삭제 -> 모든 이미지 삭제
    @Transactional
    public void deleteAllImages(int userPlantId) {
        // 1. 삭제할 다이어리 이미지 목록 조회
        List<MyPlantDiaryImageDTO> images = getImagesForDelete(userPlantId);
        // DB 삭제 - FK로 알아서 삭제 됨.
        // 2. GCP 삭제
        for (MyPlantDiaryImageDTO img : images) {
            // 3. 참조 개수 확인 후 GCP 삭제
            int count = imageStorageService.countByHash(img.getHash());
            if (count == 1) {
                imageStorageService.deleteFile(img.getSysName());
            }
        }
    }

    // 권한 체크용 - 해당 식물의 이미지인지
    public int validateDiaryImageBelongsToPlant(int imageId, int userPlantId) {
        return myPlantDiaryImageMapper.validateDiaryImageBelongsToPlant(imageId, userPlantId);
    }

}
