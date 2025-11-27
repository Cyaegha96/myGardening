package com.ggirick.gardening_back.services.board;

import com.ggirick.gardening_back.dto.board.BoardTagDTO;
import com.ggirick.gardening_back.dto.board.BoardTagMappingDTO;
import com.ggirick.gardening_back.mappers.board.BoardTagMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class BoardTagService {
    private final BoardTagMapper boardTagMapper;

    // 게시글에 연결된 태그 전체 조회
    public List<BoardTagDTO> getTagsByBoardId(int boardId) {
        return boardTagMapper.getTagsByBoardId(boardId);
    }

    // 태그명으로 태그 조회 (정규화 포함)
    public BoardTagDTO getTagByName(String tagName) {
        if (tagName == null) return null;

        String normalized = normalize(tagName);
        return boardTagMapper.getTagByName(normalized);
    }

    // 태그명 정규화: 공백 제거 + 소문자로 저장
    private String normalize(String name) {
        return name.trim().toLowerCase();
    }

    // 태그 없으면 생성 후 ID 반환
    public int getOrCreateTagId(String tagName) {

        String normalized = normalize(tagName);

        BoardTagDTO exist = getTagByName(normalized);
        if (exist != null) {
            return exist.getId();
        }

        BoardTagDTO newTag = new BoardTagDTO();
        newTag.setName(normalized);
        boardTagMapper.insertTag(newTag);

        return newTag.getId();
    }

    // 게시글 저장 시 태그 매핑 저장 (중복 방지)
    public void saveTagMappings(int boardId, List<Integer> tagIds) {

        if (tagIds == null || tagIds.isEmpty()) return;

        // 중복 매핑 방지
        Set<Integer> distinct = new HashSet<>(tagIds);

        for (int tagId : distinct) {
            boardTagMapper.insertMapping(new BoardTagMappingDTO(boardId, tagId));
        }
    }

    // 게시글 삭제 시 매핑 전체 제거
    public void deleteMappingsByBoardId(int boardId) {
        boardTagMapper.deleteMappingsByBoardId(boardId);
    }
}
