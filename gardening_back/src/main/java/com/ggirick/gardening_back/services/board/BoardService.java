package com.ggirick.gardening_back.services.board;

import com.ggirick.gardening_back.dto.board.*;
import com.ggirick.gardening_back.mappers.board.BoardMapper;
import com.ggirick.gardening_back.services.tag.PlantTagService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.HtmlUtils;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardService {
    private final BoardMapper boardMapper;
    private final BoardFileService boardFileService;
    private final BoardLikeService boardLikeService;
    private final BoardBookmarkService boardBookmarkService;

    private final BoardTagService boardTagService;
    private final PlantTagService plantTagService;

    // 커서 기반 게시글 목록
    public List<BoardResponseDTO> getListByCursor(Integer cursorId, int limit, String loginUid) {

        List<BoardResponseDTO> list = boardMapper.getListByCursor(cursorId, limit);

        for (BoardResponseDTO dto : list) {

            // 태그 추가
            dto.setTags(
                    boardTagService.getTagsByBoardId(dto.getId())
                            .stream()
                            .map(BoardTagDTO::getName)
                            .toList()
            );

            // 좋아요 / 북마크
            if (loginUid != null) {
                dto.setLiked(boardLikeService.isLiked(dto.getId(), loginUid));
                dto.setBookmarked(boardBookmarkService.isBookmarked(dto.getId(), loginUid));
            }
        }
        return list;
    }

    // 좋아요 Top3 게시물 목록
    public List<BoardResponseDTO> getTop3List(String loginUid) {

        List<BoardResponseDTO> list = boardMapper.getTop3List();

        for (BoardResponseDTO dto : list) {

            // 태그 조회 후 name만 List<String>으로 매핑
            List<String> tagNames = boardTagService.getTagsByBoardId(dto.getId())
                    .stream()
                    .map(BoardTagDTO::getName)
                    .toList();

            dto.setTags(tagNames);

            if (loginUid != null) {
                // 좋아요/북마크 여부 세팅
                dto.setLiked(boardLikeService.isLiked(dto.getId(), loginUid));
                dto.setBookmarked(boardBookmarkService.isBookmarked(dto.getId(), loginUid));
            }
        }

        return list;
    }

    // 상세 조회
    @Transactional
    public BoardResponseDTO getDetailById(int id, String loginUid) {
        // 조회수 증가
        boardMapper.increaseViewCount(id);

        // 게시글 조회
        BoardResponseDTO detail = boardMapper.getDetailById(id);
        if (detail == null) return null;

        // 파일 추가
        detail.setFiles(boardFileService.getFileListByBoardId(id));

        // 태그 추가
        detail.setTags(boardTagService.getTagsByBoardId(id)
                .stream()
                .map(BoardTagDTO::getName)
                .toList()
        );

        // 좋아요 / 북마크 여부 추가
        if (loginUid != null) {
            detail.setLiked(boardLikeService.isLiked(id, loginUid));
            detail.setBookmarked(boardBookmarkService.isBookmarked(id, loginUid));
        }

        return detail;
    }

    // 공지 게시글만 조회
    public List<BoardResponseDTO> getNotificationList() {
        return boardMapper.getNotificationList();
    }

    // 게시글 등록
    @Transactional
    public void insert(BoardRequestDTO dto, List<MultipartFile> files, String loginUid) throws Exception {
        // 공지여부 세팅
        String notification = dto.isNotification() ? "Y" : "N";

        // 스크립트/HTML 공격 방지: 제목/내용 이스케이프
        String safeTitle = HtmlUtils.htmlEscape(dto.getTitle());
        String safeContents = HtmlUtils.htmlEscape(dto.getContents());

        // 게시글 등록
        BoardDTO insertDto = BoardDTO.builder()
                .title(safeTitle)
                .contents(safeContents)
                .writerUid(loginUid) // 토큰 기반
                .isNotification(notification)
                .build();

        boardMapper.insert(insertDto);
        int boardId = insertDto.getId();

        // 사용자 최종 확정한 태그만 저장
        if (dto.getTags() != null && !dto.getTags().isEmpty()) {
            List<Integer> tagIds = new ArrayList<>();
            for (String tagName : dto.getTags()) {
                tagIds.add(boardTagService.getOrCreateTagId(tagName.trim()));
            }
            boardTagService.saveTagMappings(boardId, tagIds);
        }

        // 파일 등록 - 제일 마지막에 등록 ( 먼저 등록하면 트랜잭션 실패해도 gcp 에는 올라감 )
        if (files != null && !files.isEmpty()) {
            boardFileService.insert(files, boardId);
        }
    }

    // 게시글 수정
    @Transactional
    public int update(BoardRequestDTO dto, List<MultipartFile> newFiles, String loginUid) throws Exception {

        int boardId = dto.getId();

        // 1. DB에 저장된 기존 파일 목록 조회
        List<BoardFileDTO> oldFiles = boardFileService.getFileListByBoardId(boardId);

        // 2. 유지할 파일 ID 목록
        List<Integer> rawKeepIds = dto.getKeepFileIds();
        List<Integer> keepIds = (rawKeepIds != null) ? rawKeepIds : List.of();

        // 3. 삭제 대상 파일 목록 추출 (oldFiles - keepIds)
        List<BoardFileDTO> deleteTargets = oldFiles.stream()
                .filter(f -> !keepIds.contains(f.getId()))
                .toList();

        // 4. 삭제 대상 실제 삭제
        for (BoardFileDTO file : deleteTargets) {
            boardFileService.deleteFile(file);
        }

        // 5. 새로 업로드된 파일 저장
        if (newFiles != null && !newFiles.isEmpty()) {
            boardFileService.insert(newFiles, boardId);
        }

        // 6. 태그 갱신: 기존 태그 삭제 후, 사용자가 확정한 최종 태그만 저장
        boardTagService.deleteMappingsByBoardId(boardId);

        if (dto.getTags() != null && !dto.getTags().isEmpty()) {
            List<Integer> tagIds = new ArrayList<>();
            for (String tagName : dto.getTags()) {
                tagIds.add(boardTagService.getOrCreateTagId(tagName.trim()));
            }
            boardTagService.saveTagMappings(boardId, tagIds);
        }

        // 제목/내용 이스케이프
        String safeTitle = HtmlUtils.htmlEscape(dto.getTitle());
        String safeContents = HtmlUtils.htmlEscape(dto.getContents());

        // 7. 공지여부
        String notification = dto.isNotification() ? "Y" : "N";

        // 8. 게시글 본문/제목 등 update 처리
        BoardDTO updateDto = BoardDTO.builder()
                .id(boardId)
                .title(safeTitle)
                .contents(safeContents)
                .writerUid(loginUid)
                .isNotification(notification)
                .updatedAt(new Timestamp(System.currentTimeMillis()))
                .build();

        return boardMapper.update(updateDto);
    }

    // 삭제
    @Transactional
    public int delete(int id) {

        // 태그 삭제
        boardTagService.deleteMappingsByBoardId(id);

        // 파일 삭제
        boardFileService.deleteFileByBoardId(id);

        // soft delete (status -> delete)
        return boardMapper.delete(id);
    }

    // 검색 게시글 목록 조회
    public List<BoardResponseDTO> searchBoards(String keyword, String type, String tagName) {

        // 빈 문자열은 null 처리
        if (keyword != null && keyword.trim().isEmpty()) keyword = null;
        if (tagName != null && tagName.trim().isEmpty()) tagName = null;

        return boardMapper.searchBoards(keyword, type, tagName);
    }

    // 부모 태그 기반 게시글 필터링
    public List<BoardResponseDTO> filterBoardsByParentTag(int parentTagId) {

        // 1. PLANT_TAG에서 parentTagId 기준으로 자식 태그명(TAG_NAME) 바로 조회
        List<String> tagNames = plantTagService.getChildTagNames(parentTagId);
        if (tagNames.isEmpty()) {
            return List.of();
        }

        // 2. TAG_NAME 기준으로 게시글 조회
        return boardMapper.searchBoardsByTagNames(tagNames);
    }
}
