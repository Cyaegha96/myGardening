"use client";

import { cn } from "@/shared/shadcn/lib/utils";
import { useState } from "react";
import { Eye, MessageCircle, Heart } from "lucide-react";
import type {BoardNoImageCardProps} from "@/entities/board/model/BoardNoImageCardProps.ts";

const BoardNoImageCard = ({
                              id,
                              title,
                              contents,
                              writerProfileImage,
                              writerNickname,
                              writerBio,
                              viewCount,
                              likeCount,
                              commentCount,
                              tags,
                              onClick
                          }: BoardNoImageCardProps) => {

    const [hover, setHover] = useState(false);

    return (
        <div
            onClick={() => onClick?.(id)}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className={cn(
                "relative w-full max-w-[350px] h-[400px] bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg p-4 flex flex-col justify-between"
            )}
        >

            {/* ---------- 태그 ---------- */}
            {tags && tags.length > 0 && (
                <div className="absolute left-2 top-2 z-20">
                    <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full shadow-sm">
                        {tags[0]}
                    </span>
                </div>
            )}

            {/* ---------- 좋아요 ---------- */}
            <div className="absolute top-2 right-2 z-20 bg-white/80 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 text-sm shadow-sm">
                <Heart className="w-4 h-4 text-red-500" fill="red" />
                <span className="font-medium">{likeCount}</span>
            </div>

            {/* ---------- Hover Overlay (프로필 제외) ---------- */}
            <div
                className={cn(
                    "absolute top-0 left-0 right-0 bottom-[70px] bg-black/40 flex items-center justify-center gap-6 text-white transition-all duration-200 z-30",
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

            {/* ---------- 제목 ---------- */}
            <h3 className="font-semibold text-base z-20 pt-8 line-clamp-1 leading-snug">
                {title}
            </h3>

            {/* ---------- 내용 ---------- */}
            <p className="text-sm text-gray-600 z-20 mt-2 line-clamp-8 leading-loose">
                {contents}
            </p>

            {/* ---------- 프로필 영역 ---------- */}
            <div className="flex items-center gap-3 z-20 mt-auto pt-2">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                    {writerProfileImage && (
                        <img
                            src={writerProfileImage}
                            className="object-cover w-full h-full"
                            alt="author"
                        />
                    )}
                </div>

                <div className="flex flex-col leading-tight">
                    <span className="font-semibold text-sm">{writerNickname}</span>
                    <span className="text-xs text-gray-500">@{writerBio}</span>
                </div>
            </div>

        </div>
    );
};

export { BoardNoImageCard };
