package com.ggirick.gardening_back.services.myPlant;

import com.ggirick.gardening_back.dto.myPlant.MyPlantImageDTO;
import com.ggirick.gardening_back.dto.myPlant.MyPlantImageHistoryDTO;
import com.ggirick.gardening_back.dto.myPlant.MyPlantImageHistoryResponseDTO;
import com.ggirick.gardening_back.mappers.myPlant.MyPlantImageHistoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MyPlantImageHistoryService {

    private final MyPlantImageHistoryMapper historyMapper;
    private final MyPlantImageService imageService;

    // 1. 대표 이미지 백업 → 히스토리 최신으로 저장
    @Transactional
    public void backupImage(MyPlantImageDTO img) {

        historyMapper.insert(MyPlantImageHistoryDTO.builder()
                .userPlantId(img.getUserPlantId())
                .oriName(img.getOriName())
                .sysName(img.getSysName())
                .url(img.getUrl())
                .hash(img.getHash())
                .build()
        );

        // 히스토리 개수 초과 시 → GCP + DB 삭제
        MyPlantImageHistoryDTO oldest = historyMapper.getOldest(img.getUserPlantId());
        if (oldest != null) {
            // GCP 삭제
            imageService.deleteHistoryImageBySysName(oldest.getSysName());
            // DB 삭제
            historyMapper.deleteByHistoryId(oldest.getImageHistoryId());
        }
    }

    // 2. 히스토리 목록 조회 (ResponseDTO 변환)
    public List<MyPlantImageHistoryResponseDTO> getHistory(int userPlantId) {
        return MyPlantImageHistoryResponseDTO.ofList(historyMapper.getHistoryList(userPlantId));
    }

    // 3. 히스토리 → 대표 이미지 승격
    @Transactional
    public void promoteToThumbnail(int userPlantId, int imageHistoryId, String loginUid) throws Exception {

        // 선택된 히스토리 조회
        MyPlantImageHistoryDTO historyImg = historyMapper.getById(imageHistoryId);
        if (historyImg == null) return;

        // 대표 이미지 교체
        imageService.updateThumbnail(userPlantId, historyImg);

        // 기존 위치 제거
        historyMapper.deleteByHash(historyImg.getHash());

        // 최신 위치로 다시 삽입
        historyMapper.insert(historyImg);

        // 최대 3장 유지 → GCP + DB 정리
        MyPlantImageHistoryDTO oldest = historyMapper.getOldest(userPlantId);
        if (oldest != null) {
            imageService.deleteHistoryImageBySysName(oldest.getSysName());
            historyMapper.deleteByHistoryId(oldest.getImageHistoryId());
        }
    }
}
