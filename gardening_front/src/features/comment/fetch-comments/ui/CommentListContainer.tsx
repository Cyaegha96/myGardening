import { useEffect, useState, useCallback } from "react";
import CommentList from "@/entities/comment/ui/CommentList";

import {
    BoardCommentControllerApi,
    BoardCommentLikeControllerApi,
    type BoardCommentResponseDTO,
} from "@/shared/api";

import type { CommentListContainerProps } from "@/features/comment/fetch-comments/model/CommentListContainerProps";
import CommentItem from "@/widgets/comment/CommentItem.tsx";

export default function CommentListContainer({
                                                 boardId,
                                                 onReady,
                                                 onReply,
                                                 onDelete,
                                                 onEdit,
                                                 onReport,
                                                 replyTarget,
                                                 onSubmitReply,
                                                 onCancelReply,
                                             }: CommentListContainerProps) {

    const [bestComments, setBestComments] = useState<BoardCommentResponseDTO[]>([]);
    const [normalComments, setNormalComments] = useState<BoardCommentResponseDTO[]>([]);

    const api = new BoardCommentControllerApi();

    // 트리에서 특정 댓글 전체 subtree 찾기
    const findTreeById = (
        list: BoardCommentResponseDTO[],
        id: number
    ): BoardCommentResponseDTO | null => {
        for (const c of list) {
            if (c.id === id) return c;
            if (c.children) {
                const found = findTreeById(c.children, id);
                if (found) return found;
            }
        }
        return null;
    };

    // 전체 댓글 조회
    const load = useCallback(async () => {
        try {
            const [bestRes, allRes] = await Promise.all([
                api.getBestComments(boardId),
                api.getComments(boardId),
            ]);

            const all = allRes.data;

            // 베스트 댓글에 children 트리까지 붙이기
            const best = bestRes.data.map((b) => {
                const tree = findTreeById(all, b.id);
                return tree ? tree : b;
            });

            setBestComments(best);
            setNormalComments(all);
        } catch (err) {
            console.error("댓글 조회 실패", err);
        }
    }, [boardId]);

    // 초기 로딩
    useEffect(() => {
        load();
        onReady?.(load);
    }, [load, onReady]);

    // 특정 댓글만 트리 업데이트
    const updateTree = (
        list: BoardCommentResponseDTO[],
        id: number,
        updateFn: (c: BoardCommentResponseDTO) => BoardCommentResponseDTO
    ): BoardCommentResponseDTO[] => {
        return list.map((c) => {
            if (c.id === id) return updateFn(c);
            if (c.children) {
                return { ...c, children: updateTree(c.children, id, updateFn) };
            }
            return c;
        });
    };

    // 좋아요 토글
    const handleToggleLike = async (id: number, liked: boolean) => {
        const likeAPI = new BoardCommentLikeControllerApi();
        await likeAPI.toggleLike(id);

        // normal 트리 갱신
        setNormalComments((prev) =>
            updateTree(prev, id, (c) => {
                const safe = c.likeCount ?? 0;
                return {
                    ...c,
                    liked: !liked,
                    likeCount: !liked ? safe + 1 : safe - 1,
                };
            })
        );

        // best 트리 갱신
        setBestComments((prev) =>
            updateTree(prev, id, (c) => {
                const safe = c.likeCount ?? 0;
                return {
                    ...c,
                    liked: !liked,
                    likeCount: !liked ? safe + 1 : safe - 1,
                };
            })
        );
    };

    return (
        <div>

            {/* 베스트 댓글 */}
            {bestComments.length > 0 && (
                <div className="mb-8 p-4 rounded-lg border border-yellow-300 bg-yellow-50">
                    <div className="font-semibold text-sm text-yellow-700 mb-3">
                        👑 베스트 댓글 Top 3
                    </div>

                    <div className="space-y-3">
                        {bestComments.map((c) => (
                            <CommentItem
                                key={c.id}
                                comment={c}
                                depth={0}
                                onReply={onReply!}
                                onLike={handleToggleLike}
                                onDelete={onDelete}
                                onEdit={onEdit}
                                onReport={onReport}
                                replyTarget={replyTarget}
                                onSubmitReply={onSubmitReply}
                                onCancelReply={onCancelReply}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* 전체 댓글 */}
            <CommentList
                comments={normalComments}
                onReply={onReply}
                onLike={handleToggleLike}
                onDelete={onDelete}
                onEdit={onEdit}
                onReport={onReport}
                replyTarget={replyTarget}
                onSubmitReply={onSubmitReply}
                onCancelReply={onCancelReply}
            />
        </div>
    );
}