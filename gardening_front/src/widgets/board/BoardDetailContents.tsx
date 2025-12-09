import { Card, CardContent } from "@/shared/shadcn/components/ui/card.tsx";
import { Activity } from "@/entities/board/ui/activity-with-number-flow.tsx";
import type { BoardDetailContentsProps } from "@/entities/board/model/BoardDetailContentsProps.ts";
import { useState } from "react";
import TagListModal from "@/entities/board/ui/TagListModal.tsx";
import BoardWriterButtons from "@/entities/board/ui/BoardWriterButtons.tsx";
import BoardImageSlider from "@/entities/board/ui/BoardImageSlider.tsx";
import BoardDetailBody from "@/entities/board/ui/BoardDetailBody.tsx";
import {useNavigate} from "react-router-dom";

export default function BoardDetailContents({
                                                data,
                                                liked,
                                                bookmarked,
                                                likeCount,
                                                bookmarkCount,
                                                onLike,
                                                onBookmark,
                                                loginUid,
                                                onEdit,
                                                onDelete,
                                                commentOpen,
                                                onToggleComments,

                                                setReportOpen
                                            }: BoardDetailContentsProps) {

    const images = (data.files ?? [])
        .map(f => f.url)
        .filter((url): url is string => typeof url === "string");

    const hasImages = images.length > 0 || (data.thumbnail ?? "") !== "";

    const [tagModalOpen, setTagModalOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <Card className="w-full max-w-2xl bg-white rounded-2xl shadow overflow-hidden">
            <CardContent className="p-0">

                {/* 상단 좌측 '목록으로' */}
                <div className="w-full px-8 pb-2 flex">
                    <button
                        onClick={() => navigate("/board")}
                        className="text-gray-600 hover:text-black text-sm"
                    >
                        ← 목록으로
                    </button>
                </div>

                {hasImages && (
                    <>
                        <BoardImageSlider
                            images={images}
                            fallback={data.thumbnail ?? ""}
                        />

                        <div className="m-5">
                            <Activity
                                viewCount={data.viewCount ?? 0}
                                commentCount={data.commentCount ?? 0}
                                likeCount={likeCount}
                                bookmarkCount={bookmarkCount}
                                liked={liked}
                                bookmarked={bookmarked}
                                onLike={onLike}
                                onBookmark={onBookmark}
                                onToggleComments={onToggleComments}

                                setReportOpen={setReportOpen}
                            />
                        </div>
                    </>
                )}

                <div className="px-6">
                    <BoardDetailBody
                        title={data.title}
                        contents={data.contents}
                        createdAt={data.createdAt}
                    />

                    {loginUid === data.writerUid && (
                        <div className="flex justify-end gap-3 mb-4">
                            <BoardWriterButtons
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        </div>
                    )}

                    {!hasImages && (
                        <div className="my-4">
                            <Activity
                                viewCount={data.viewCount ?? 0}
                                commentCount={data.commentCount ?? 0}
                                likeCount={likeCount}
                                bookmarkCount={bookmarkCount}
                                liked={liked}
                                bookmarked={bookmarked}
                                onLike={onLike}
                                onBookmark={onBookmark}
                                onToggleComments={onToggleComments}
                                setReportOpen={setReportOpen}
                            />
                        </div>
                    )}

                    {/* 댓글 / 태그 토글 영역 */}
                    <div className="flex justify-between items-center text-sm text-gray-500 cursor-pointer mt-4 mb-3">
                        <span onClick={onToggleComments}>
                            {commentOpen
                                ? "댓글 접기 ▲"
                                : `댓글 ${data.commentCount}개 모두 보기 ▼`}
                        </span>

                        <span onClick={() => setTagModalOpen(true)}>
                            태그 {data.tags?.length ?? 0}개 모두 보기
                        </span>
                    </div>

                    <TagListModal
                        open={tagModalOpen}
                        onClose={setTagModalOpen}
                        tags={data.tags ?? []}
                    />
                </div>
            </CardContent>
        </Card>
    );
}