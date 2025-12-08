package com.ggirick.gardening_back.services.potList;

import com.ggirick.gardening_back.dto.potList.PotListDetailDTO;
import com.ggirick.gardening_back.dto.potList.PotListInsertDTO;
import com.ggirick.gardening_back.dto.potList.PotListPatchDTO;
import com.ggirick.gardening_back.enums.potList.PotListStatus;
import com.ggirick.gardening_back.mappers.potList.PotListMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;

import static com.ggirick.gardening_back.config.PotListConfig.MAX_AUTHOR_OTHER_POSTS;

@Service
@RequiredArgsConstructor
public class PotListService {
    private final PotListMapper potListMapper;

    // 분양글 목록 조회
    public List<PotListDetailDTO> getPotList(
            OffsetDateTime cursorId,
            Integer size,
            String keyword,
            String searchType,
            List<Integer> tagIds,
            String location
    ) {
        return potListMapper.getPotList(cursorId, size, keyword, searchType, tagIds, location);
    }

    // 사용자 Uid를 통한 분양글 목록 조회
    public List<PotListDetailDTO> getPotByUserId(String userUid) {
        return potListMapper.getPotByUserId(userUid, MAX_AUTHOR_OTHER_POSTS);
    }

    // 분양글 상세 조회
    public PotListDetailDTO getPotById(int id) {
        return potListMapper.getPotById(id);
    }

    // 분양글 작성
    public int insertPot(PotListInsertDTO insertInfo) {
        return potListMapper.insertPot(insertInfo);
    }

    // 분양글 다음 시퀀스번호 조회
    public int getPotListSeqNextVal() {
        return potListMapper.getPotListSeqNextVal();
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
