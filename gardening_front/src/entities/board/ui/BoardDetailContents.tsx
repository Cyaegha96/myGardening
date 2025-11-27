import { Card, CardContent } from "@/shared/shadcn/components/ui/card";
import { Activity } from "@/entities/board/ui/activity-with-number-flow";
import type { BoardDetailContentsProps } from "@/entities/board/model/BoardDetailContentsProps";
import { useState } from "react";

export default function BoardDetailContents({
                                                data,
                                                liked,
                                                bookmarked,
                                                likeCount,
                                                bookmarkCount,
                                                onLike,
                                                onBookmark,
                                            }: BoardDetailContentsProps) {

    // 파일 슬라이드용 상태
    const images = data.files?.map(f => f.url) ?? [];
    const [current, setCurrent] = useState(0);

    const nextImage = () => {
        setCurrent((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrent((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <Card className="w-full max-w-2xl bg-white rounded-2xl shadow overflow-hidden">
            <CardContent className="p-0">

                {/* ───────────────── 이미지 슬라이드 영역 ───────────────── */}
                <div className="w-full flex justify-center mb-4 relative">
                    <div className="w-[90%] rounded-md overflow-hidden relative">

                        {/* 이미지 */}
                        <img
                            src={images[current] || data.thumbnail || ""}
                            alt="post image"
                            className="w-full aspect-square object-cover transition-all duration-300"
                        />

                        {/* 좌우 버튼 (파일 2개 이상일 때만) */}
                        {images.length > 1 && (
                            <>
                                {/* Prev */}
                                <button
                                    onClick={prevImage}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-2 hover:bg-black/60 transition"
                                >
                                    {"<"}
                                </button>

                                {/* Next */}
                                <button
                                    onClick={nextImage}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-2 hover:bg-black/60 transition"
                                >
                                    {">"}
                                </button>
                            </>
                        )}

                        {/* 하단 점(dot) 인디케이터 */}
                        {images.length > 1 && (
                            <div className="absolute bottom-3 w-full flex justify-center gap-2">
                                {images.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-2 h-2 rounded-full transition ${
                                            idx === current ? "bg-white" : "bg-white/40"
                                        }`}
                                    ></div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ───────────────── Activity Bar ───────────────── */}
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
                    />
                </div>

                {/* ───────────────── 본문 ───────────────── */}
                <div className="px-6">

                    {/* 제목 */}
                    <h1 className="text-xl font-semibold mb-4">
                        {data.title}
                    </h1>

                    {/* 내용 */}
                    <div className="text-[15px] leading-relaxed whitespace-pre-line mb-6">
                        {data.contents}
                    </div>

                    {/* 작성 시간 */}
                    {data.createdAt && (
                        <div className="text-xs text-gray-400 mb-5 text-right">
                            {new Date(data.createdAt).toLocaleString()}
                        </div>
                    )}

                    {/* 댓글 보기 */}
                    <div className="text-sm text-gray-500 cursor-pointer mt-4 mb-3">
                        댓글 {data.commentCount}개 모두 보기
                    </div>

                </div>
            </CardContent>
        </Card>
    );
}
