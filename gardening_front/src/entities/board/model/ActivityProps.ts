// src/entities/board/model/activity.model.ts

export type ActivityProps = {
    viewCount: number,
    commentCount: number,
    likeCount: number,
    bookmarkCount: number,
    liked: boolean,
    bookmarked: boolean,
    onLike: () => void,
    onBookmark: () => void,
    onToggleComments: () => void,
    setReportOpen: (open: boolean) => void
};
