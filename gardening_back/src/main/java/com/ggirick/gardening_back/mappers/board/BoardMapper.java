package com.ggirick.gardening_back.mappers.board;

import com.ggirick.gardening_back.dto.board.BoardDTO;
import com.ggirick.gardening_back.dto.board.BoardResponseDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BoardMapper {

    // 커서 기반 무한 스크롤
    List<BoardResponseDTO> getListByCursor(
            @Param("cursorId") Integer cursorId,
            @Param("limit") int limit
    );

    // 좋아요 Top3 게시물 조회
    List<BoardResponseDTO> getTop3List();

    // 상세 조회
    BoardResponseDTO getDetailById(int id);

    // 공지사항
    List<BoardResponseDTO> getNotificationList();

    // 등록
    int insert(BoardDTO dto);

    // 수정
    int update(BoardDTO dto);

    // 삭제
    int delete(int id);

    // 조회수 증가
    int increaseViewCount(int id);
}
