package com.ggirick.gardening_back.mappers.board;

import com.ggirick.gardening_back.dto.board.BoardResponseDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BoardLikeMapper {

    // 좋아요 추가
    int insertLike(@Param("boardId") int boardId, @Param("loginUid") String loginUid);

    // 좋아요 삭제
    int deleteLike(@Param("boardId") int boardId, @Param("loginUid") String loginUid);

    // 좋아요 여부
    boolean isLiked(@Param("boardId") int boardId, @Param("loginUid") String loginUid);

    // 좋아요 수 증가
    int increaseLikeCount(int boardId);

    // 좋아요 수 감소
    int decreaseLikeCount(int boardId);

    // 내 좋아요 목록 조회
    List<BoardResponseDTO> getLikedList(String userUid);
}
