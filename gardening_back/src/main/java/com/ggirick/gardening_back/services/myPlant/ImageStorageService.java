package com.ggirick.gardening_back.services.myPlant;

import com.ggirick.gardening_back.dto.myPlant.MyPlantImageDTO;
import com.ggirick.gardening_back.mappers.myPlant.ImageReferenceMapper;
import com.ggirick.gardening_back.utils.FileUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ImageStorageService { // GCP 삭제용 공용 서비스
    private final FileUtil fileUtil;
    private final ImageReferenceMapper imageReferenceMapper;

    // 중복 이미지 조회 (대표 + 히스토리 + 다이어리 전체 범위)
    public MyPlantImageDTO findEntityByHash(String hash) {
        return imageReferenceMapper.findEntityByHash(hash);
    }

    // 같은 Hash 쓰는 DB가 있는지 조회
    public int countByHash(String hash) {
        return imageReferenceMapper.countByHash(hash);
    }

    @Transactional
    public void deleteFile(String sysName) {
        fileUtil.deleteFile(sysName);
    }
}
