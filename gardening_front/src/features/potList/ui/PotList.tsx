import {cn} from "@/shared/shadcn/lib/utils.ts";
import {Heart, MessageCircle} from "lucide-react";
import type {PotListDetailDTO} from "@/shared/api";
import {potListApi} from "@/entities/potList/api/potListApi.ts";
import {usePotListStore} from "@/entities/potList/model/potListStore.ts";
import {useChatStore} from "@/entities/potList/model/chatStore.ts";

export default function PotList({
                                    id,
                                    title,
                                    description,
                                    thumbnail,
                                    price,
                                    writerName,
                                    bookmarkCount,
                                    chatroomCount,
                                    status,
                                    type,
                                    bumpedAt,
                                    createdAt,
                                    tags
                                }: PotListDetailDTO) {
    const fetchPotList = usePotListStore(state => state.fetchPotList);
    const fetchBookmarkPotLists = usePotListStore(state => state.fetchBookmarkPotLists);

    const setChatSheetOpen = useChatStore(state => state.setSheetOpen);
    const setSelectedRoom = useChatStore(state => state.setSelectedRoom);

    return (
        <div
            className={cn(
                "relative w-full max-w-[350px] h-[250px] bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg",
                status === "AFTER_TRADE" && "opacity-50"
            )}
        >
            {/* ---------- 이미지 영역 ---------- */}
            <div className="relative h-[60%] w-full">

                <img
                    src={thumbnail}
                    className="object-cover w-full h-full"
                    alt="thumbnail"
                />

                {/* 판매 상태 */}
                {status && status !== "BEFORE_TRADE" && (
                    <div className="absolute left-2 top-2 z-20">
                        {status === "PENDING_TRADE" && (
                            <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded-full shadow-sm">
                                예약중
                            </span>
                        )}

                        {status === "AFTER_TRADE" && (
                            <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded-full shadow-sm">
                                거래완료
                            </span>
                        )}
                    </div>
                )}

                {status && status !== "AFTER_TRADE" &&
                    <>
                        {/* 찜 카운트 */}
                        <div
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (id != null) {
                                    potListApi.toggleLike(id).then(() => {
                                        fetchPotList();
                                        fetchBookmarkPotLists();
                                    });
                                }
                            }}
                            className="absolute top-2 right-2 z-20 hover:bg-gray-300 transition bg-white backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 text-sm shadow-sm">
                            <Heart className="w-4 h-4 text-red-500" fill="red"/>
                            <span className="font-medium">{bookmarkCount}</span>
                        </div>

                        {/* 채팅방 카운트 */}
                        <div
                            className="absolute top-10 right-2 z-20 bg-white/80 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 text-sm shadow-sm">
                            <MessageCircle className="w-4 h-4 text-green-700" fill="green"/>
                            <span className="font-medium">{chatroomCount}</span>
                        </div>
                    </>
                }
            </div>

            {/* ---------- 텍스트 영역 ---------- */}
            <div className="px-4 py-3 flex flex-col justify-between h-[40%]">
                <h3 className="text-base line-clamp-1 leading-snug truncate">{title}</h3>
                <h2 className="font-bold text-base line-clamp-2 leading-snug truncate">{price}원</h2>
                <p className="text-xs text-gray-600 line-clamp-2 leading-loose truncate">
                    신림동 - 18일전
                </p>
            </div>
        </div>
    );
}
