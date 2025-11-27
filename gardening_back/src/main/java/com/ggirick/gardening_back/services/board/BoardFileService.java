package com.ggirick.gardening_back.services.board;

import com.ggirick.gardening_back.dto.board.BoardFileDTO;
import com.ggirick.gardening_back.mappers.board.BoardFileMapper;
import com.ggirick.gardening_back.services.file.FileService;
import com.ggirick.gardening_back.utils.FileUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BoardFileService {
    private final BoardFileMapper boardFileMapper;
    private final FileUtil fileUtil;
    private final FileService fileService;

    // 게시글 기준 파일 전체 조회
    public List<BoardFileDTO> getFileListByBoardId(int boardId) {
        return boardFileMapper.getFileListByBoardId(boardId);
    }

    // 개별 파일 조회
    public BoardFileDTO getFileById(int id) {
        return boardFileMapper.getFileById(id);
    }

    // 파일 등록
    @Transactional
    public void insert(List<MultipartFile> files, int boardId) throws Exception{
        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                // 원본 파일명
                String oriName = file.getOriginalFilename();
                // 파일 경로
                String folderPath = ("board/" + boardId + "/");

                // 1. GCP 업로드 후 sysName, publicUrl 반환
                Map<String, String> fileInfo = fileUtil.uploadFileAndGetInfo(oriName, folderPath, file);

                // 2. DB에 업로드
                boardFileMapper.insert(
                        BoardFileDTO
                                .builder()
                                .oriName(fileInfo.get("oriName"))
                                .sysName(fileInfo.get("sysName"))
                                .url(fileInfo.get("url"))
                                .boardId(boardId)
                                .build()
                );
            }
        }
    }

    // 파일 삭제
    public void deleteFile(BoardFileDTO dto) {
        // 1. DB에서 파일 정보 조회
        BoardFileDTO resultDTO = boardFileMapper.getFileById(dto.getId());
        if (resultDTO == null) return; // 이미 삭제되었거나 없음

        // 2. DB 삭제 - id로
        boardFileMapper.deleteFile(resultDTO.getId());

        // 3. GCP 삭제 - sysName으로
        fileService.deleteFile(resultDTO.getSysName());
    }

    // 게시글 삭제 시 전체 파일 삭제
    public void deleteFileByBoardId(int boardId) {

        List<BoardFileDTO> list = boardFileMapper.getFileListByBoardId(boardId);

        // GCP 삭제
        for (BoardFileDTO file : list) {
            fileUtil.deleteFile(file.getSysName());
        }

        // DB 삭제
        boardFileMapper.deleteFileByBoardId(boardId);
    }
}
