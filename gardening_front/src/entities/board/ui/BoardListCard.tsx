"use client";

import { cn } from "@/shared/shadcn/lib/utils";
import { Eye, MessageCircle, Heart } from "lucide-react";
import { useState } from "react";
import type { BoardListCardProps } from "@/entities/board/model/BoardListCardProps.ts";

const BoardListCard = ({
                           id,
                           title,
                           contents,
                           thumbnail,
                           writerProfileImage,
                           writerNickname,
                           writerBio,
                           viewCount,
                           likeCount,
                           commentCount,
                           tags,
                           onClick        // 이벤트 받아오기
                       }: BoardListCardProps) => {

    const [hover, setHover] = useState(false);

    return (
        <div
            onClick={() => onClick?.(id)}   // ← id 전달해서 사용
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className={cn(
                "relative w-full max-w-[350px] h-[400px] bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg"
            )}
        >
            {/* ---------- 이미지 영역 ---------- */}
            <div className="relative h-[55%] w-full">

                <img
                    src={thumbnail}
                    className="object-cover w-full h-full"
                    alt="thumbnail"
                />

                {/* 태그 */}
                {tags && tags.length > 0 && (
                    <div className="absolute left-2 top-2 z-20">
                        <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full shadow-sm">
                            {tags[0]}
                        </span>
                    </div>
                )}

                {/* 좋아요 */}
                <div className="absolute top-2 right-2 z-20 bg-white/80 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 text-sm shadow-sm">
                    <Heart className="w-4 h-4 text-red-500" fill="red" />
                    <span className="font-medium">{likeCount}</span>
                </div>

                {/* Hover Overlay */}
                <div
                    className={cn(
                        "absolute inset-0 bg-black/40 flex items-center justify-center gap-6 text-white transition-all duration-200 z-10",
                        hover ? "opacity-100" : "opacity-0"
                    )}
                >
                    <div className="flex items-center gap-1">
                        <Eye className="w-5 h-5" />
                        <span className="text-sm">{viewCount}</span>
                    </div>

                    <div className="flex items-center gap-1">
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm">{commentCount}</span>
                    </div>
                </div>
            </div>

            {/* ---------- 텍스트 & 프로필 영역 ---------- */}
            <div className="px-4 py-3 flex flex-col justify-between h-[45%]">

                {/* 제목 */}
                <h3 className="font-semibold text-base line-clamp-1 leading-snug">
                    {title}
                </h3>

                {/* 내용 */}
                <p className="text-sm text-gray-600 line-clamp-2 mt-2 leading-loose">
                    {contents}
                </p>

                {/* 프로필 */}
                <div className="flex items-center gap-3 mt-auto">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                        {writerProfileImage && (
                            <img
                                src={writerProfileImage}
                                className="object-cover w-full h-full"
                                alt="profile"
                            />
                        )}
                    </div>

                    <div className="flex flex-col leading-tight">
                        <span className="font-semibold text-sm">{writerNickname}</span>
                        <span className="text-xs text-gray-500">@{writerBio}</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export { BoardListCard };
