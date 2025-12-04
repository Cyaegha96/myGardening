import {useState} from "react";
import {cn} from "@/shared/shadcn/lib/utils.ts";
import {Heart, MessageCircle} from "lucide-react";
import type {PotListDetailDTO} from "@/shared/api";

export default function PotList({
                                    title,
                                    description,
                                    thumbnail,
                                    price,
                                    writerName,
                                    bookmarkCount,
                                    chatroomCount,
                                    type,
                                    bumpedAt,
                                    createdAt,
                                    tags
                                }: PotListDetailDTO) {
    return (
        <div
            // onClick={() => onClick?.(id)}   // ← id 전달해서 사용
            className={cn(
                "relative w-full max-w-[350px] h-[250px] bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg"
            )}
        >
            {/* ---------- 이미지 영역 ---------- */}
            <div className="relative h-[60%] w-full">

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

                {/* 찜 된 카운트 */}
                <div
                    className="absolute top-2 right-2 z-20 bg-white/80 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 text-sm shadow-sm">
                    <Heart className="w-4 h-4 text-red-500" fill="red"/>
                    <span className="font-medium">{bookmarkCount}</span>
                </div>

                {/* 활성 채팅 방 카운트 */}
                <div
                    className="absolute top-10 right-2 z-20 bg-white/80 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 text-sm shadow-sm">
                    <MessageCircle className="w-4 h-4 text-green-700" fill="green"/>
                    <span className="font-medium">{chatroomCount}</span>
                </div>
            </div>

            {/* ---------- 텍스트 & 프로필 영역 ---------- */}
            <div className="px-4 py-3 flex flex-col justify-between h-[40%]">

                {/* 제목 */}
                <h3 className="text-base line-clamp-1 leading-snug truncate">
                    {title}
                </h3>

                {/* 가격 */}
                <h2 className="font-bold text-base line-clamp-2 leading-snug truncate">
                    {price}원
                </h2>

                {/* 지역, 지난 날짜(끌어올리기를 했다면 끌어올리기로 부터 지난 날짜 */}
                <p className="text-xs text-gray-600 line-clamp-2 leading-loose truncate">
                    신림동 - 18일전
                </p>
            </div>
        </div>
    );
};