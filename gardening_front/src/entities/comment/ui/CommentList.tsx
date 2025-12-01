import CommentItem from "@/widgets/comment/CommentItem";
import type { CommentListProps } from "@/entities/comment/model/CommentListProps";

export default function CommentList({
                                        comments,
                                        onReply,
                                        onLike,
                                        onDelete,
                                        onEdit,
                                        onReport,
                                        replyTarget,
                                        onSubmitReply,
                                        onCancelReply,
                                    }: CommentListProps) {
    return (
        <div>
            {comments.map(c => (
                <CommentItem
                    key={c.id}
                    comment={c}
                    onReply={onReply}
                    onLike={onLike}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    onReport={onReport}
                    replyTarget={replyTarget}
                    onSubmitReply={onSubmitReply}
                    onCancelReply={onCancelReply}
                />
            ))}
        </div>
    );
}