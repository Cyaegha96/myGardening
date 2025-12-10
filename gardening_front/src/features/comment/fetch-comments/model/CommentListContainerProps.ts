export interface CommentListContainerProps {
    boardId: number;
    // 부모에게 fetchComments 전달하는 콜백
    onReady: (refreshFn: () => void) => void;

    // 댓글에 "답글" 클릭했을 때
    onReply: (commentId: number, nickname: string) => void;

    // 수정/삭제/신고
    onDelete: (commentId: number) => void | Promise<void>;
    onEdit: (commentId: number, contents: string) => void | Promise<void>;
    onReport: (commentId: number, wrtierId:string) => void | Promise<void>;

    // 답글 input용
    replyTarget?: { id: number; nickname: string } | null;
    onSubmitReply?: (contents: string) => void;
    onCancelReply?: () => void;
}
