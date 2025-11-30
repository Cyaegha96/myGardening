package com.ggirick.gardening_back.utils;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class FileUtil {

    private final Storage storage;

    @Value("${spring.cloud.gcp.storage.bucket}")
    private String bucketName;

    // 파일 업로드(실제 저장된 파일명을 반환)
    public String fileUpload(String oriName, String path, MultipartFile file) throws Exception {
        String sysName = path + UUID.randomUUID() + "_" + oriName;
        BlobInfo blobInfo =
                BlobInfo.newBuilder(BlobId.of(bucketName, sysName))
                        .setContentType(file.getContentType())
                        .build();

        try (InputStream is = file.getInputStream()) {
            storage.createFrom(blobInfo, is);
        }

        return sysName;
    }

   //url 만들기
    public String getPublicUrl(String objectName) {
        return String.format("https://storage.googleapis.com/%s/%s", bucketName, objectName);
    }

    //파일 업로드 후 추가로 공개 url까지 반환
    public String uploadAndGetUrl(String oriName, String path, MultipartFile file) throws Exception {
        String objectName = fileUpload(oriName, path, file);
        return getPublicUrl(objectName);
    }

    // 파일 업로드 후 실제 저장된 파일명(oriName, sysName)과 공개 URL을 함께 반환
    public Map<String, String> uploadFileAndGetInfo(String oriName, String path, MultipartFile file) throws Exception {

        String sysName = fileUpload(oriName, path, file);


        String url = getPublicUrl(sysName);


        return Map.of(
                "oriName",oriName,
                "sysName", sysName,  // 실제 저장된 파일명 (GCS 내 object 이름)
                "url", url            // 공개 접근 가능한 URL
        );
    }

    // 파일 다운로드
    public byte[] fileDownload(String sysName) {
        Blob blob = storage.get(bucketName, sysName);
        return blob.getContent();
    }

    // 폴더 삭제
    public void deleteFolder(String folderName) {
        // folderName 예: "board/images" 또는 "board/images/"
        String prefix = folderName.endsWith("/") ? folderName : folderName + "/";

        Iterable<Blob> blobs = storage.list(bucketName, Storage.BlobListOption.prefix(prefix)).iterateAll();

        for (Blob blob : blobs) {
            storage.delete(blob.getBlobId());
        }
    }

    // 파일 삭제
    public void deleteFile(String sysName) {
        BlobId blobId = BlobId.of(bucketName, sysName);
        log.info("Deleting: {}", sysName);
        boolean result = storage.delete(blobId);
        log.info("Deleted? {}", result);
    }
}
