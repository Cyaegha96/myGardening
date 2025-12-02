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
    public int updatePotById(PotListPatchDTO patchInfo, boolean addViewCount, boolean bump) {
        return potListMapper.updatePotById(patchInfo, addViewCount, bump);
    }

    // 분양글 삭제
    public int deletePotById(int id) {
        return potListMapper.deletePotById(id);
    }

    // 분양글 거래완료
    public int completeTrade(int id) {
        PotListPatchDTO patchInfo = new PotListPatchDTO();
        patchInfo.setId(id);
        patchInfo.setStatus(PotListStatus.AFTER_TRADE); // 또는 Enum 적용 가능
        return potListMapper.updatePotById(patchInfo, false, false);
    }

    // 분양글 끌어올리기
    public int bumpPot(int id) {
        PotListPatchDTO patchInfo = new PotListPatchDTO();
        patchInfo.setId(id);
        return potListMapper.updatePotById(patchInfo, false, true);
    }

    // 분양글 조회수 증가
    public int addViewCount(int id) {
        PotListPatchDTO patchInfo = new PotListPatchDTO();
        patchInfo.setId(id);
        return potListMapper.updatePotById(patchInfo, true, false);
    }
}
