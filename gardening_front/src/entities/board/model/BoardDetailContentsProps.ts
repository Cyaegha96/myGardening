import type { BoardResponseDTO } from "@/shared/api";

export interface BoardDetailContentsProps {
    data: BoardResponseDTO;
    liked: boolean;
    bookmarked: boolean;
    likeCount: number;
    bookmarkCount: number;
    onLike: () => void;
    onBookmark: () => void;
}