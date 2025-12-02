import type {BoardCommentResponseDTO} from "@/shared/api";

export interface CommentListProps {
    comments: BoardCommentResponseDTO[];

    onReply: (parentId: number, parentNickname: string) => void;
    onLike: (id: number, liked: boolean) => void;
    onDelete: (id: number) => void;
    onEdit: (id: number, content: string) => void;
    onReport: (id: number) => void;

    // 답글 input용
    replyTarget?: { id: number; nickname: string } | null;
    onSubmitReply?: (contents: string) => void;
    onCancelReply?: () => void;
}
