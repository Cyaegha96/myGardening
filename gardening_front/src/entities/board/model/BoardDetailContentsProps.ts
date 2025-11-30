import type { BoardResponseDTO } from "@/shared/api";

export interface BoardDetailContentsProps {
    data: BoardResponseDTO;
    liked: boolean;
    bookmarked: boolean;
    likeCount: number;
    bookmarkCount: number;
    onLike: () => void;
    onBookmark: () => void;
    loginUid?: string;

    // 수정 클릭시
    onEdit?: () => void;
    // 삭제 클릭시
    onDelete?: () => void;

    // 댓글용
    commentOpen: boolean;
    onToggleComments: () => void;
}