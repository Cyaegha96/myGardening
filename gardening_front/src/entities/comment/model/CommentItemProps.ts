import type {CommentNode} from "@/entities/comment/model/CommentNode.ts";

export interface CommentItemProps {
    comment: CommentNode;
    onReply: (id: number, nickname: string) => void;
    onLike: (id: number, liked: boolean) => void;
    onDelete: (id: number) => void;
    onEdit: (id: number, content: string) => void;
    onReport: (id: number,writerNickName:string) => void;
    depth?: number;

    // 답글 input용
    replyTarget?: { id: number; nickname: string } | null;
    onSubmitReply?: (contents: string) => void;
    onCancelReply?: () => void;
}