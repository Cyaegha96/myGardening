package com.ggirick.gardening_back.services.potList;

import com.ggirick.gardening_back.dto.potList.PotListDetailDTO;
import com.ggirick.gardening_back.mappers.potList.PotListBookmarkMapper;
import com.ggirick.gardening_back.mappers.potList.PotListMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PotListBookmarkService {
    private final PotListBookmarkMapper potListBookmarkMapper;
    private final PotListService potListService;

    // 북마크 토글
    public void togglePotListBookmark(int id, String userUid) {
        PotListDetailDTO pot = potListService.getPotById(id);
        if (pot != null) {
            try {
                potListBookmarkMapper.bookmarkPot(id, userUid);
            } catch (Exception e) {
                potListBookmarkMapper.unBookmarkPot(id, userUid);
            }
        }
    }
}
