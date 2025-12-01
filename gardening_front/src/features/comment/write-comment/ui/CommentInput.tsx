import { useState } from "react";
import { Button } from "@/shared/shadcn/components/ui/button.tsx";
import type { CommentInputProps } from "@/features/comment/write-comment/model/CommentInputProps.ts";

export default function CommentInput({
                                         parentId,
                                         parentNickname,
                                         onSubmit,
                                         onCancel
                                     }: CommentInputProps) {

    const [text, setText] = useState("");

    const handleSubmit = () => {
        const trimmed = text.trim();
        if (!trimmed) return;

        // parentId 는 일반 댓글이면 0, 대댓글이면 부모 id
        onSubmit(trimmed, parentId ?? 0);

        setText("");

        // 대댓글 작성 후 reply 모드 자동 종료
        if (onCancel) onCancel();
    };

    const handleCancel = () => {
        setText("");
        if (onCancel) onCancel();
    };

    return (
        <div className="mt-3">

            {/* ====== 대댓글 모드 안내 ====== */}
            {parentNickname && parentId !== 0 && (
                <div className="flex items-center text-green-600 text-sm mb-1 gap-2">
                    <span>@{parentNickname} 에게 답글 작성 중…</span>

                    <button
                        className="text-red-500 text-xs underline"
                        onClick={handleCancel}
                    >
                        취소
                    </button>
                </div>
            )}

            {/* ====== 입력창 ====== */}
            <div className="flex items-start gap-2">
                <textarea
                    className="flex-1 border rounded p-2 h-[60px] resize-none"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="댓글을 입력하세요"
                />

                <Button
                    className="h-[60px] whitespace-nowrap"
                    onClick={handleSubmit}
                >
                    등록
                </Button>
            </div>
        </div>
    );
}