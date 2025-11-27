package com.ggirick.gardening_back.services.board;

import com.ggirick.gardening_back.dto.board.BoardCommentDTO;
import com.ggirick.gardening_back.dto.board.BoardCommentResponseDTO;
import com.ggirick.gardening_back.mappers.board.BoardCommentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BoardCommentService {
    private final BoardCommentMapper boardCommentMapper;

    // 게시글 기준 댓글 전체 조회 + 트리 구조 변환
    public List<BoardCommentResponseDTO> getCommentsWithTree(int boardId, String loginUid) {

        // 1) 전체 댓글 목록 조회
        List<BoardCommentResponseDTO> list = boardCommentMapper.getByBoardId(boardId, loginUid);

        // 댓글이 없으면 빈 리스트 반환
        if (list == null || list.isEmpty()) return List.of();

        // 2) children 리스트 초기화
        for (BoardCommentResponseDTO c : list) { // 대댓글 없으면 빈 리스트 반환
            c.setChildren(new ArrayList<>());
        }

        // 3) 댓글 ID를 key로 한 Map 구성 - 그래야 부모 찾을 때 개수가 많아도 오래 안 걸림.
        Map<Integer, BoardCommentResponseDTO> map = new HashMap<>();
        for (BoardCommentResponseDTO c : list) {
            map.put(c.getId(), c);

            // isMine 세팅 - 로그인 사용자 == 댓글 작성자인지
            c.setMine(loginUid != null && loginUid.equals(c.getWriterUid()));

            // UI 출력용 시간 포맷팅
            if (c.getCreatedAt() != null) {
                c.setCreatedAtFormatted(formatTime(c.getCreatedAt()));
            }
        }

        // 4) 루트 댓글(부모 댓글)만 담을 리스트
        List<BoardCommentResponseDTO> roots = new ArrayList<>();

        // 5) 트리 구성
        for (BoardCommentResponseDTO comment : list) {

            // 부모가 없는 경우 (refCommentId = 0 or null)
            if (comment.getRefCommentId() == 0 || comment.getRefCommentId() == -1) {
                roots.add(comment);
                continue;
            } else {
                // 부모 댓글 찾기
                BoardCommentResponseDTO parent = map.get(comment.getRefCommentId());
                // 부모가 존재할때만 children에 추가
                if (parent != null) {
                    parent.getChildren().add(comment);
                    comment.setParentWriterNickname(parent.getWriterNickname()); // 멘션 표시용
                }
            }
        }

        // 6) 삭제된 댓글 UI 처리 규칙 적용
        List<BoardCommentResponseDTO> filteredRoots = new ArrayList<>();
        for (BoardCommentResponseDTO root : roots) {

            if (root.getStatus().equals("DELETE")) {

                // 부모 댓글이 삭제됐고 자식이 있음 → "삭제된 댓글입니다." 표시
                if (!root.getChildren().isEmpty()) {
                    root.setContents("삭제된 댓글입니다.");
                    filteredRoots.add(root);
                }
                // 자식도 없는 삭제된 댓글 → 완전 숨김
                continue;
            }
            if (root.getStatus().equals("BLOCKED")) {
                // 관리자 규제된 댓글은 무조건 표시
                root.setContents("관리자에 의해 규제된 댓글입니다.");
                filteredRoots.add(root);
                continue;
            }

            // ACTIVE 댓글
            filteredRoots.add(root);
        }

        // 7) 대댓글 삭제 처리 (UI에서 숨길 수 있도록)
        for (BoardCommentResponseDTO root : filteredRoots) {
            List<BoardCommentResponseDTO> visibleChildren = new ArrayList<>();

            for (BoardCommentResponseDTO child : root.getChildren()) {

                // 삭제된 댓글인 경우
                if (child.getStatus().equals("DELETE")) {
                    // 대댓글 삭제 → UI에서 완전 숨김
                    continue;
                }

                // 신고돼서 규제된 댓글인 경우
                if (child.getStatus().equals("BLOCKED")) {
                    child.setContents("관리자에 의해 규제된 댓글입니다.");
                }
                visibleChildren.add(child);

            }

            root.setChildren(visibleChildren);
        }

        // 트리구조로 완성된 댓글 목록 반환
        return filteredRoots;
    }

    // 댓글 등록
    public int insertComment(BoardCommentDTO dto) {
        return boardCommentMapper.insert(dto);
    }

    // 댓글 수정
    public int updateComment(BoardCommentDTO dto) {
        dto.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        return boardCommentMapper.update(dto);
    }

    // 댓글 삭제
    public int deleteComment(int id) {
        return boardCommentMapper.delete(id);
    }

    // 댓글 규제
    public int blockComment(int id) {
        return boardCommentMapper.blockComment(id);
    }

    // 좋아요 토글
    public boolean toggleLike(int commentId, String loginUid) {
        int exists = boardCommentMapper.existsLike(commentId, loginUid);

        if (exists > 0) {
            boardCommentMapper.deleteLike(commentId, loginUid);
            return false; // 좋아요 취소됨
        } else {
            boardCommentMapper.insertLike(commentId, loginUid);
            return true;  // 좋아요 추가됨
        }
    }

    // 작성시간 "3시간 전" 포맷 변환
    private String formatTime(Timestamp time) {
        long diff = (System.currentTimeMillis() - time.getTime()) / 1000;
        if (diff < 60) return diff + "초 전";
        if (diff < 3600) return (diff / 60) + "분 전";
        if (diff < 86400) return (diff / 3600) + "시간 전";
        return (diff / 86400) + "일 전";
    }
}
