package com.ggirick.gardening_back.mappers.board;

import com.ggirick.gardening_back.dto.board.BoardCommentDTO;
import com.ggirick.gardening_back.dto.board.BoardCommentResponseDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BoardCommentMapper {

    // 전체 댓글 리스트 (boardId 기준, BEST → 최신 정렬)
    List<BoardCommentResponseDTO> getByBoardId(@Param("boardId") int boardId,
                                               @Param("loginUid") String loginUid);

    // 단건 조회 (권한 체크용 등)
    BoardCommentResponseDTO getById(int id);

    // 등록
    int insert(BoardCommentDTO dto);

    // 수정
    int update(BoardCommentDTO dto);

    // 삭제
    int delete(int id);

    // 규제
    int blockComment(int id);

    // 좋아요 여부 체크
    int existsLike(@Param("commentId") int commentId,
                   @Param("loginUid") String loginUid);

    // 좋아요 추가
    int insertLike(@Param("commentId") int commentId,
                   @Param("loginUid") String loginUid);

    // 좋아요 삭제
    int deleteLike(@Param("commentId") int commentId,
                   @Param("loginUid") String loginUid);
}
