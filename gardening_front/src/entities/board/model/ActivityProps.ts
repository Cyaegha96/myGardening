// src/entities/board/model/activity.model.ts

export type ActivityProps = {
    viewCount: number;     // 조회수
    commentCount: number;  // 댓글 수
    likeCount: number;     // 좋아요 수
    bookmarkCount: number; // 북마크 수 (DTO에 있어야 함!)

    liked: boolean;       // 좋아요 여부
    bookmarked: boolean;  // 북마크 여부

    onLike: () => void;       // 좋아요 클릭
    onBookmark: () => void;   // 북마크 클릭
};
