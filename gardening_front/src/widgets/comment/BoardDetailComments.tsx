import { useCommentSubmit } from "@/features/comment/write-comment/model/useCommentSubmit.ts";
import { useRef, useState } from "react";
import CommentInput from "@/features/comment/write-comment/ui/CommentInput.tsx";
import CommentListContainer from "@/features/comment/fetch-comments/ui/CommentListContainer.tsx";
import {BoardCommentControllerApi, ReportControllerApi} from "@/shared/api";
import {type AuthState, useAuthStore} from "@/entities/auth/useAuthStore.tsx";

export default function BoardDetailComments({ boardId }: { boardId: number }) {
    const { submit } = useCommentSubmit(boardId);
    const isLoggedIn = useAuthStore((s:AuthState) => s.isLoggedIn);
    // 현재 답글 대상
    const [replyTarget, setReplyTarget] = useState<{ id: number; nickname: string } | null>(null);

    // CommentListContainer 내부의 refresh 함수
    const refreshRef = useRef<() => void>(() => {});

    // 댓글 삭제
    const handleDeleteComment = async (commentId: number) => {
        try {
            const api = new BoardCommentControllerApi();
            await api.deleteComment(boardId, commentId);

            refreshRef.current?.();
        } catch (err) {
            console.error("댓글 삭제 오류:", err);
        }
    };

    // 댓글 수정
    const handleEditComment = async (commentId: number, contents: string) => {
        try {
            const api = new BoardCommentControllerApi();
            await api.updateComment(boardId, commentId, { contents });

            refreshRef.current?.();
        } catch (err: any) {
            console.error("댓글 수정 실패:", err);

            if (err?.response?.status === 403) {
                alert("본인 댓글만 수정할 수 있습니다.");
            } else {
                alert("댓글 수정 중 오류가 발생했습니다.");
            }
        }
    };

    // 댓글 신고
    const handleReportComment = async (commentId: number,wrtierId:string) => {
        console.log("신고 : " + commentId);
        const api = new ReportControllerApi();
        await api.createReport({
            targetId:boardId,
            targetType:"BOARD_COMMENT",
            reason:"해당 게시판의 "+ wrtierId+"의 댓글이 신고되었습니다.",
        });
        alert("신고가 접수되었습니다.");

    };

    return (
        <div className="bg-white p-4 rounded-xl shadow mt-4 w-full max-w-2xl">
            {isLoggedIn? /* 부모 댓글 입력 */
                <CommentInput
                    parentId={replyTarget?.id}
                    parentNickname={replyTarget?.nickname}
                    onSubmit={async (text) => {
                        await submit(text, replyTarget?.id);

                        refreshRef.current?.();
                        setReplyTarget(null);
                    }}
                    onCancel={() => setReplyTarget(null)}
                />: <span>로그인 중인 사용자만 댓글을 작성할 수 있습니다</span>}
            

            <div className="mt-4 border-t pt-4">
                <CommentListContainer
                    boardId={boardId}

                    // refresh 연결
                    onReady={(refreshFn: () => void) => {
                        refreshRef.current = refreshFn;
                    }}

                    // 답글 대상 설정
                    onReply={(id, nickname) => {
                        setReplyTarget({ id, nickname });
                    }}

                    // 댓글 삭제
                    onDelete={handleDeleteComment}

                    // 댓글 수정
                    onEdit={handleEditComment}

                    // 댓글 신고
                    onReport={handleReportComment}

                    // reply 기능 전달
                    replyTarget={replyTarget}
                    onSubmitReply={async (text) => {
                        await submit(text, replyTarget?.id);
                        refreshRef.current?.();
                        setReplyTarget(null);
                    }}
                    onCancelReply={() => setReplyTarget(null)}
                />
            </div>
        </div>
    );
}