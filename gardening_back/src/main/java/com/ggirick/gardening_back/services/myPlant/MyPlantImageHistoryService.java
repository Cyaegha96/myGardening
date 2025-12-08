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

    // 최대 저장 가능한 히스토리 개수
    private static final int MAX_HISTORY_COUNT = 3;

    // 1. 대표 이미지 백업 → 히스토리 최신으로 저장
    @Transactional
    public void backupImage(MyPlantImageDTO img) {

        if (img == null) return;

        // 히스토리 중복 방지
        historyMapper.deleteByHash(img.getHash());

        // 신규 히스토리 저장
        historyMapper.insert(
                MyPlantImageHistoryDTO.builder()
                        .userPlantId(img.getUserPlantId())
                        .oriName(img.getOriName())
                        .sysName(img.getSysName())
                        .url(img.getUrl())
                        .hash(img.getHash())
                        .build()
        );

        trimHistory(img.getUserPlantId()); // 3개 초과 시 제거
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

        // 기존 대표 이미지 조회
        MyPlantImageDTO currentThumb = imageService.getThumbnailByPlantId(userPlantId);

        // 대표 이미지 교체
        imageService.updateThumbnail(userPlantId, historyImg);

        // 기존 대표 이미지는 히스토리로 저장
        if (currentThumb != null) {
            backupImage(currentThumb);
        }

        // 승격된 이미지는 히스토리에서 제거
        historyMapper.deleteByHistoryId(imageHistoryId);

        trimHistory(userPlantId); // 히스토리 개수 정리
    }

    // 4. 히스토리 최대 개수 유지
    private void trimHistory(int userPlantId) {

        int count = historyMapper.getCountByPlantId(userPlantId);
        if (count <= MAX_HISTORY_COUNT) return;

        MyPlantImageHistoryDTO oldest = historyMapper.getOldest(userPlantId);
        if (oldest != null) {
            imageService.deleteHistoryImageBySysName(oldest.getSysName());
            historyMapper.deleteByHistoryId(oldest.getImageHistoryId());
        }
    }
}
