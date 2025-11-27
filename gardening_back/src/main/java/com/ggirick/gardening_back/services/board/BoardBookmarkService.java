package com.ggirick.gardening_back.services.board;

import com.ggirick.gardening_back.dto.board.BoardResponseDTO;
import com.ggirick.gardening_back.mappers.board.BoardBookmarkMapper;
import com.ggirick.gardening_back.mappers.board.BoardLikeMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardBookmarkService {
    private final BoardBookmarkMapper boardBookmarkMapper;

    // 북마크 여부
    public boolean isBookmarked(int boardId, String userUid) {
        return boardBookmarkMapper.isBookmarked(boardId, userUid);
    }

    // 북마크 추가
    @Transactional
    public void insertBookmark(int boardId, String loginUid) {
        boardBookmarkMapper.insertBookmark(boardId, loginUid);
    }

    // 북마크 취소
    @Transactional
    public void deleteBookmark(int boardId, String loginUid) {
        boardBookmarkMapper.deleteBookmark(boardId, loginUid);
    }

    // 유저 북마크 목록
    public List<BoardResponseDTO> getBookmarkedList(String loginUid) {
        return boardBookmarkMapper.getBookmarkList(loginUid);
    }

}
