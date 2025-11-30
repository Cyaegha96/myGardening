package com.ggirick.gardening_back.services.board;

import com.ggirick.gardening_back.dto.board.BoardResponseDTO;
import com.ggirick.gardening_back.mappers.board.BoardLikeMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardLikeService {
    private final BoardLikeMapper boardLikeMapper;

    // 좋아요 여부 확인
    public boolean isLiked(int boardId, String loginUid) {
        return boardLikeMapper.isLiked(boardId, loginUid);
    }

    // 좋아요 추가
    @Transactional
    public void insertLike(int boardId, String loginUid) {
        boardLikeMapper.insertLike(boardId, loginUid);
        boardLikeMapper.increaseLikeCount(boardId); // 좋아요 수 증가
    }

    // 좋아요 취소
    @Transactional
    public void deleteLike(int boardId, String loginUid) {
        boardLikeMapper.deleteLike(boardId, loginUid);
        boardLikeMapper.decreaseLikeCount(boardId); // 좋아요 수 감소
    }

    // 내 좋아요 목록 조회
    public List<BoardResponseDTO> getLikedList(String userUid) {
        return boardLikeMapper.getLikedList(userUid);
    }
}
