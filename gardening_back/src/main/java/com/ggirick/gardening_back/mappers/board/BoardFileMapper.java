package com.ggirick.gardening_back.mappers.board;

import com.ggirick.gardening_back.dto.board.BoardFileDTO;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface BoardFileMapper {

    // 게시글 기준 파일 전체 조회
    List<BoardFileDTO> getFileListByBoardId(int boardId);

    // 개별 파일 조회
    BoardFileDTO getFileById(int id);

    // 파일 등록
    int insert(BoardFileDTO dto);

    // 파일 삭제
    int deleteFile(int id);

    // 게시글 삭제 시 전체 파일 삭제
    int deleteFileByBoardId(int boardId);
}
