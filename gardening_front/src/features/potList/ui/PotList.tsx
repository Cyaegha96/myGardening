import {cn} from "@/shared/shadcn/lib/utils.ts";
import {Heart, MessageCircle} from "lucide-react";
import type {PotListDetailDTO} from "@/shared/api";
import {potListApi} from "@/entities/potList/api/potListApi.ts";
import {usePotListStore} from "@/entities/potList/model/potListStore.ts";
import {useNavigate} from "react-router-dom";
import {getRelativeTime} from "@/shared/libs/getRelativeTime.ts";
import {formatPrice} from "@/entities/potList/libs/formatPrice.ts";
import {usePotDetailStore} from "@/entities/potList/model/potDetailStore.ts";
import {useEffect, useState} from "react";
import {type AddressParts, splitKoreanAddress} from "@/shared/libs/splitKoreanAddress.ts";

export default function PotList({
                                    id,
                                    title,
                                    description,
                                    thumbnail,
                                    price,
                                    writerName,
                                    location,
                                    bookmarkCount,
                                    chatroomCount,
                                    status,
                                    type,
                                    bumpedAt,
                                    createdAt
                                }: PotListDetailDTO) {
    const fetchBookmarkPotLists = usePotListStore(state => state.fetchBookmarkPotLists);
    const bookmarkPotLists = usePotListStore(state => state.bookmarkPotLists);
    const setBookmarkCount = usePotListStore(state => state.setBookmarkCount);
    const setOtherPotBookmarkCount = usePotDetailStore(state => state.setOtherPotBookmarkCount);


    const [addressParts, setAddressParts] = useState<AddressParts>();

    // 가장 최신 날짜 선택 및 상대시간으로 조정
    const relativeTime =
        (bumpedAt && new Date(bumpedAt) > new Date(createdAt!)
            ? "끌올 "
            : "") +
        getRelativeTime(bumpedAt!);

    const navigate = useNavigate();

    useEffect(() => {
        if (location) {
            setAddressParts(splitKoreanAddress(location));
        }
    }, []);

    return (
        <div
            className={cn(
                "relative w-full max-w-[350px] h-[250px] bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg",
                status === "AFTER_TRADE" && "opacity-50"
            )}
            onClick={() => navigate(`/pot-list/${id}`)}
        >
            {/* ---------- 이미지 영역 ---------- */}
            <div className="relative h-[60%] w-full">

                {thumbnail ? (
                    <img
                        src={thumbnail}
                        alt="썸네일"
                        className="w-full h-40 object-cover rounded-t-md"
                    />
                ) : (
                    <div
                        className="w-full h-40 rounded-t-md bg-secondary flex items-center justify-center text-secondary-foreground text-md">
                        등록된 사진 없음
                    </div>
                )}

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
                                        fetchBookmarkPotLists();

                                        const isBookmarked = bookmarkPotLists.some(item => item.id === id);

                                        if (isBookmarked) {
                                            setBookmarkCount(id, bookmarkCount! - 1);
                                            setOtherPotBookmarkCount(id, bookmarkCount! - 1);
                                        } else {
                                            setBookmarkCount(id, bookmarkCount! + 1);
                                            setOtherPotBookmarkCount(id, bookmarkCount! + 1);
                                        }
                                    });
                                }
                            }}
                            className="absolute top-2 right-2 z-20 hover:bg-gray-300 transition bg-white backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 text-sm shadow-sm">
                            <Heart
                                className="w-4 h-4 text-red-500"
                                fill={
                                    bookmarkPotLists.some(item => item.id === id) ? "red" : "transparent"
                                }
                            />
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
                <h3 className="text-base pt-2 line-clamp-1 leading-snug truncate">{title}</h3>
                <h2 className="font-bold text-base line-clamp-2 leading-snug truncate">
                    {type === "SELL" ? (price && price! > 0 ? `${formatPrice(price)}원` : "무료 나눔") : "삽니다"}
                </h2>
                <p className="text-xs text-gray-600 line-clamp-2 leading-loose truncate">
                    {addressParts ? [
                            addressParts.province,
                            addressParts.district,
                            addressParts.neighborhood
                        ]
                            .filter(Boolean) // undefined/null 제거
                            .join(" ")
                        : "거래지역 미지정"}·{relativeTime}
                </p>
            </div>
        </div>
    );
}
