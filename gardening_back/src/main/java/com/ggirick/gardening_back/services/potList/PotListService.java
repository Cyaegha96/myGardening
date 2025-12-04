package com.ggirick.gardening_back.services.potList;

import com.ggirick.gardening_back.dto.potList.PotListDetailDTO;
import com.ggirick.gardening_back.dto.potList.PotListInsertDTO;
import com.ggirick.gardening_back.dto.potList.PotListPatchDTO;
import com.ggirick.gardening_back.enums.potList.PotListStatus;
import com.ggirick.gardening_back.mappers.potList.PotListMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PotListService {
    private final PotListMapper potListMapper;

    // 분양글 목록 조회
    public List<PotListDetailDTO> getPotList(
            Integer cursorId,
            Integer size,
            String keyword,
            List<Integer> tagIds
    ) {
        return potListMapper.getPotList(cursorId, size, keyword, tagIds);
    }

    // 분양글 상세 조회
    public PotListDetailDTO getPotById(int id) {
        return potListMapper.getPotById(id);
    }

    // 분양글 작성
    public int insertPot(PotListInsertDTO insertInfo) {
        return potListMapper.insertPot(insertInfo);
    }

    // 분양글 수정
    public int updatePotById(int id, PotListPatchDTO patchInfo, boolean addViewCount, boolean bump) {
        patchInfo.setId(id);
        return potListMapper.updatePotById(patchInfo, addViewCount, bump);
    }

    // 분양글 삭제
    public int deletePotById(int id) {
        return potListMapper.deletePotById(id);
    }

    // 분양글 거래완료
    public int completeTrade(int id) {
        PotListPatchDTO patchInfo = new PotListPatchDTO();
        patchInfo.setStatus(PotListStatus.AFTER_TRADE);
        return updatePotById(id, patchInfo, false, false);
    }

    // 분양글 거래예약
    public int reserveTrade(int id) {
        PotListPatchDTO patchInfo = new PotListPatchDTO();
        patchInfo.setStatus(PotListStatus.PENDING_TRADE);
        return updatePotById(id, patchInfo, false, false);
    }

    // 분양글 판매중
    public int beforeTrade(int id) {
        PotListPatchDTO patchInfo = new PotListPatchDTO();
        patchInfo.setStatus(PotListStatus.BEFORE_TRADE);
        return updatePotById(id, patchInfo, false, false);
    }

    // 분양글 끌어올리기
    public int bumpPot(int id) {
        return updatePotById(id, new PotListPatchDTO(), false, true);
    }

    // 분양글 조회수 증가
    public int addViewCount(int id) {
        return updatePotById(id, new PotListPatchDTO(), true, false);
    }
}
