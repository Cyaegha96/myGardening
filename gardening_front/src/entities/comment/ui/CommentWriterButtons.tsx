import type {CommentWriterButtonsProps} from "@/entities/comment/model/CommentWriterButtonsProps.ts";

export default function CommentWriterButtons({
                                                 onDelete,
                                                 onEdit,
                                                 onReport,
                                                 mine = false,
                                             }: CommentWriterButtonsProps) {
    return (
        <div className="flex gap-4 text-xs">

            {/* 작성자가 아닌 경우 → 신고 */}
            {!mine && (
                <button
                    className="text-red-500"
                    onClick={() => onReport?.()}
                >
                    신고
                </button>
            )}

            {/* 작성자인 경우 → 수정, 삭제 */}
            {mine && (
                <>
                    <button
                        className="text-blue-500"
                        onClick={() => onEdit?.()}
                    >
                        수정
                    </button>

                    <button
                        className="text-red-500"
                        onClick={onDelete}
                    >
                        삭제
                    </button>
                </>
            )}
        </div>
    );
}