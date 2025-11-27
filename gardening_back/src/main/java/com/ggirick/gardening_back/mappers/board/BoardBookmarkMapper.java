package com.ggirick.gardening_back.mappers.board;

import com.ggirick.gardening_back.dto.board.BoardResponseDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BoardBookmarkMapper {
    // 북마크 추가
    int insertBookmark(@Param("boardId") int boardId,
                       @Param("loginUid") String loginUid);

    // 북마크 취소
    int deleteBookmark(@Param("boardId") int boardId, @Param("loginUid") String loginUid);

    boolean isBookmarked(@Param("boardId") int boardId, @Param("loginUid") String loginUid);

    // 유저 북마크 목록
    List<BoardResponseDTO> getBookmarkList(String loginUid);
}
