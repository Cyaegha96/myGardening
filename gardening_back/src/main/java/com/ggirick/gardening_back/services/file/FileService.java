package com.ggirick.gardening_back.services.file;

import com.ggirick.gardening_back.dto.plant.PlantInfoRequestFileDTO;
import com.ggirick.gardening_back.dto.plant.PlantSearchRequestFileDTO;
import com.ggirick.gardening_back.mappers.plant.PlantMapper;
import com.ggirick.gardening_back.utils.FileUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class FileService {
    private final FileUtil fileUtil;

    private final PlantMapper plantMapper;

    /**
     * 파일 업로드 후 GCS 공개 URL 반환
     *
     * @param file 업로드할 파일
     * @param folderPath 업로드할 경로 (예: "chat/images/" or "workspace/icons/")
     * @return Map GCS 공개 URL,실제 저장된 파일명(oriName, sysName)
     */
    public Map<String, String> uploadFile(MultipartFile file, String folderPath) throws Exception {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("업로드할 파일이 존재하지 않습니다.");
        }

        return fileUtil.uploadFileAndGetInfo(file.getOriginalFilename(), folderPath, file);
    }


    @Async // ⭐ 이 메서드는 호출 즉시 별도의 스레드에서 실행됩니다.
    public void uploadFileAsync(MultipartFile file, String folderPath) {
        try {
            Map<String, String> uploadInfo = uploadFile(file, folderPath);
            // 업로드 정보(URL 등)를 DB에 저장하는 로직을 여기에 추가할 수 있습니다.
            System.out.println("GCS 업로드 비동기 완료. URL: " + uploadInfo.get("publicUrl"));

        } catch (Exception e) {
            // 비동기 스레드에서 발생한 예외는 메인 스레드로 전파되지 않으므로, 로그 기록이 중요합니다.
            System.err.println("GCS 파일 업로드 중 비동기 오류 발생: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Async // ⭐ 이 메서드는 호출 즉시 별도의 스레드에서 실행됩니다.
    public void uploadFileAsyncPlantInfoRequest(MultipartFile file, String folderPath, long logId) {
        try {
            Map<String, String> uploadInfo = fileUtil.uploadFileAndGetInfo(file.getOriginalFilename(), folderPath, file);
            // 업로드 정보(URL 등)를 DB에 저장하는 로직을 여기에 추가할 수 있습니다.
            System.out.println("GCS 업로드 비동기 완료. URL: " + uploadInfo.get("url"));

            //db에 사용자가 요청한 파일을 저장합니다.


            plantMapper.insertPlantSearchRequestFile(PlantSearchRequestFileDTO.builder()
                    .url(uploadInfo.get("url"))
                    .oriName(uploadInfo.get("oriName"))
                    .sysName(uploadInfo.get("sysName"))
                            .logId(logId)
                    .build());

        } catch (Exception e) {
            // 비동기 스레드에서 발생한 예외는 메인 스레드로 전파되지 않으므로, 로그 기록이 중요합니다.
            System.err.println("GCS 파일 업로드 중 비동기 오류 발생: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * 파일 삭제 (URL 또는 sysName 모두 지원)
     *
     * @param sysName 파일의 sysname
     */
    public void deleteFile(String sysName) {


        fileUtil.deleteFile(sysName);
    }

    /**
     * 폴더 삭제
     *
     * @param folderName 삭제할 폴더의 이름 (예: file/1/
     */
    public void deleteFolder(String folderName) {
        fileUtil.deleteFolder(folderName);
    }
}
