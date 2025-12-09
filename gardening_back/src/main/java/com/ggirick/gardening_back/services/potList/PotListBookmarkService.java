package com.ggirick.gardening_back.services.potList;

import com.ggirick.gardening_back.dto.potList.PotListDetailDTO;
import com.ggirick.gardening_back.mappers.potList.PotListBookmarkMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PotListBookmarkService {
    private final PotListBookmarkMapper potListBookmarkMapper;
    private final PotListService potListService;

    // 북마크 토글
    public void togglePotListBookmark(int id, String userUid) {
        List<PotListDetailDTO> bookmarkList = potListBookmarkMapper.getBookmarksByUserId(userUid);

        // 현재 id가 이미 찜 목록에 있는지 확인
        boolean alreadyBookmarked = bookmarkList.stream()
                .anyMatch(item -> item.getId() == id);

        if (alreadyBookmarked) {
            // 존재하면 → 찜 해제
            potListBookmarkMapper.unBookmarkPot(id, userUid);
        } else {
            // 존재하지 않으면 → 찜 추가
            potListBookmarkMapper.bookmarkPot(id, userUid);
        }
    }

    // 사용자 uid에 따른 북마크 목록 조회
    public List<PotListDetailDTO> getBookmarksByUserId(String userUid) {
        return potListBookmarkMapper.getBookmarksByUserId(userUid);
    }
}
