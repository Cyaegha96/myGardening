import { useState } from "react";

import { CommentAvatar } from "@/entities/comment/ui/CommentAvatar";
import { CommentHeader } from "@/entities/comment/ui/CommentHeader";
import { LikeButton } from "@/features/comment/toggle-like/ui/LikeButton";
import { CommentEditArea } from "@/features/comment/edit-comment/ui/CommentEditArea";
import { CommentDeleteModal } from "@/features/comment/delete-comment/ui/CommentDeleteModal";
import { CommentReportModal } from "@/features/comment/report-comment/ui/CommentReportModal";
import CommentWriterButtons from "@/entities/comment/ui/CommentWriterButtons";

import CommentInput from "@/features/comment/write-comment/ui/CommentInput";

import type { CommentItemProps } from "@/entities/comment/model/CommentItemProps";
import type { CommentNode } from "@/entities/comment/model/CommentNode";


// 자식 active 댓글 개수 계산
function getDescendantCount(comment: CommentNode): number {
    if (!comment.children || comment.children.length === 0) return 0;

    return comment.children.reduce((sum: number, child: CommentNode) => {
        const isActive = child.status === "active";
        return sum + (isActive ? 1 : 0) + getDescendantCount(child);
    }, 0);
}

export default function CommentItem({
                                        comment,
                                        depth = 0,
                                        onReply,
                                        onLike,
                                        onDelete,
                                        onEdit,
                                        onReport,
                                        replyTarget,
                                        onSubmitReply,
                                        onCancelReply,
                                    }: CommentItemProps) {

    const visualDepth = depth === 0 ? 0 : 1;

    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.contents);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [showReplies, setShowReplies] = useState(false);

    const isDeleted = comment.status === "delete";
    const isBlocked = comment.status === "blocked";
    const isActive = comment.status === "active";

    const hasChildren = comment.children && comment.children.length > 0;

    // 삭제 + 자식 없음 → 완전 숨김
    if (isDeleted && !hasChildren) return null;

    const replyCount = getDescendantCount(comment);
    const isRepliesVisible = depth === 0 ? showReplies : true;

    return (
        <div className="my-4">

            {/* 댓글 한 줄 */}
            <div
                className="flex gap-2"
                style={{ marginLeft: visualDepth * 40 }}
            >

                {/* 규제 댓글은 아바타 숨김 */}
                {!isBlocked && (
                    <CommentAvatar src={comment.writerProfileUrl} />
                )}

                <div className="flex-1">

                    {/* 규제 댓글은 닉네임/시간 숨김 */}
                    {!isBlocked && (
                        <CommentHeader
                            nickname={comment.writerNickname}
                            time={comment.createdAtFormatted}
                        />
                    )}

                    {/* 부모 닉네임 mention */}
                    {!isBlocked && comment.parentWriterNickname && (
                        <div className="text-green-600 text-sm mt-1">
                            @{comment.parentWriterNickname}
                        </div>
                    )}

                    {/* 본문 */}
                    <div className="flex justify-between items-start mt-1">

                        {/* 수정 모드 */}
                        {isEditing && isActive && (
                            <CommentEditArea
                                value={editText}
                                onChange={setEditText}
                            />
                        )}

                        {/* 본문 표시 */}
                        {!isEditing && (
                            <div
                                className={
                                    `text-sm whitespace-pre-line flex-1 ` +
                                    (isActive
                                        ? "text-gray-800"
                                        : "text-gray-400 italic")
                                }
                            >
                                {comment.contents}
                            </div>
                        )}

                        {/* 좋아요: active만 */}
                        {!isEditing && isActive && (
                            <div className="ml-4 mt-1">
                                <LikeButton
                                    liked={!!comment.liked}
                                    likeCount={comment.likeCount ?? 0}
                                    onToggle={() => onLike(comment.id, !!comment.liked)}
                                />
                            </div>
                        )}
                    </div>

                    {/* 수정 버튼 */}
                    {isEditing && isActive && (
                        <div className="flex gap-2 mt-2">
                            <button
                                className="text-sm text-blue-500"
                                onClick={() => {
                                    onEdit(comment.id, editText);
                                    setIsEditing(false);
                                }}
                            >
                                완료
                            </button>

                            <button
                                className="text-sm text-gray-500"
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditText(comment.contents);
                                }}
                            >
                                취소
                            </button>
                        </div>
                    )}

                    {/* 하단 버튼: active만 */}
                    {!isEditing && isActive && (
                        <div className="flex items-center gap-4 mt-2 text-xs">
                            <button
                                className="text-gray-500"
                                onClick={() =>
                                    onReply(comment.id, comment.writerNickname)
                                }
                            >
                                답글 달기
                            </button>

                            <CommentWriterButtons
                                mine={!!comment.mine}
                                onEdit={() => setIsEditing(true)}
                                onDelete={() => setShowDeleteModal(true)}
                                onReport={() => setShowReportModal(true)}
                            />
                        </div>
                    )}

                    {/* 답글 N개 보기: 최상위 댓글만 */}
                    {depth === 0 && replyCount > 0 && (
                        <div className="mt-1 select-none">
                            <button
                                className="text-xs text-gray-400"
                                onClick={() => setShowReplies(prev => !prev)}
                            >
                                {showReplies
                                    ? "——— 답글 숨기기"
                                    : `——— 답글 ${replyCount}개 모두 보기`}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ⭐ 대댓글 입력창: replyTarget이 현재 댓글일 때만 표시 */}
            {replyTarget?.id === comment.id && (
                <div className="ml-[40px] mt-3">
                    <CommentInput
                        parentId={comment.id}
                        parentNickname={comment.writerNickname}
                        onSubmit={(text) => onSubmitReply?.(text)}
                        onCancel={onCancelReply}
                    />
                </div>
            )}

            {/* 자식 댓글 */}
            {isRepliesVisible && comment.children && (
                <div className="mt-2">
                    {comment.children.map(child => (
                        <CommentItem
                            key={child.id}
                            comment={child}
                            depth={depth + 1}
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
            )}

            {/* 삭제 모달 */}
            <CommentDeleteModal
                open={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={() => {
                    onDelete(comment.id);
                    setShowDeleteModal(false);
                }}
            />

            {/* 신고 모달 */}
            <CommentReportModal
                open={showReportModal}
                onClose={() => setShowReportModal(false)}
                onConfirm={() => {
                    onReport?.(comment.id);
                    setShowReportModal(false);
                }}
            />
        </div>
    );
}