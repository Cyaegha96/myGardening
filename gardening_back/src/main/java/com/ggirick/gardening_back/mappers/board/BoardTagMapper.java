package com.ggirick.gardening_back.mappers.board;

import com.ggirick.gardening_back.dto.board.BoardTagDTO;
import com.ggirick.gardening_back.dto.board.BoardTagMappingDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BoardTagMapper {
    // 게시글 기준 태그 조회
    List<BoardTagDTO> getTagsByBoardId(int boardId);

    // 태그명으로 조회
    BoardTagDTO getTagByName(@Param("tagName") String tagName);

    // 새 태그 등록
    int insertTag(BoardTagDTO dto);

    // 매핑 저장
    int insertMapping(BoardTagMappingDTO dto);

    // 게시글의 모든 태그 매핑 삭제
    int deleteMappingsByBoardId(int boardId);
}
