import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,} from "@/shared/shadcn/components/ui/sheet";
import {Button} from "@/shared/shadcn/components/ui/button";
import {Heart, MessageCircle} from "lucide-react";
import {useEffect, useState} from "react";
import {usePotListStore} from "@/entities/potList/model/potListStore.ts";
import {potListApi} from "@/entities/potList/api/potListApi.ts";
import {useNavigate} from "react-router-dom";
import {usePotDetailStore} from "@/entities/potList/model/potDetailStore.ts";
import {formatPrice} from "@/entities/potList/libs/formatPrice.ts";

export default function PotBookmarkDrawer() {
    const [isSheetOpen, setSheetOpen] = useState<boolean>(false);

    const fetchBookmarkPotLists = usePotListStore(state => state.fetchBookmarkPotLists);
    const bookmarkPotLists = usePotListStore(state => state.bookmarkPotLists);
    const setBookmarkCount = usePotListStore(state => state.setBookmarkCount);
    const setBookmarkCountOnDetail = usePotDetailStore(state => state.setBookmarkCount);
    const setOtherPotBookmarkCount = usePotDetailStore(state => state.setOtherPotBookmarkCount);

    const navigate = useNavigate();

    useEffect(() => {
        fetchBookmarkPotLists();
    }, []);

    return (
        <div>
            <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                    <div className="fixed bottom-57 right-6 md:bottom-65 md:right-8 z-50">
                        <Button
                            className="
                                        cursor-pointer relative bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg
                                        w-12 h-12        /* 모바일 */
                                        md:w-16 md:h-16  /* 데스크탑 */
                                        transition-transform hover:scale-105
                                    "
                        >
                            <Heart className="size-5 md:size-6"/>
                        </Button>
                    </div>
                </SheetTrigger>

                <SheetContent
                    side="right"
                    className="min-w-full md:min-w-1/5 flex flex-col z-150"
                >
                    <SheetHeader>
                        <SheetTitle>
                            찜 한 분양글
                        </SheetTitle>
                    </SheetHeader>

                    {/* 목록 */}
                    <div className="overflow-auto">
                        {bookmarkPotLists.length === 0 && (
                            <p className="text-sm text-gray-500 ms-5">찜 한 분양글이 없습니다.</p>
                        )}

                        {bookmarkPotLists.map((item, idx) => (
                            <div
                                key={idx}
                                className={`relative flex items-center gap-3 p-2 rounded-lg 
                                bg-green-50 dark:bg-green-900 hover:bg-green-100 dark:hover:bg-green-800 
                                cursor-pointer transition m-1 truncate`}
                                onClick={() => {
                                    navigate(`/pot-list/${item.id}`);
                                    setSheetOpen(false);
                                }}
                            >
                                {item.thumbnail ? (
                                    <img
                                        src={item.thumbnail}
                                        alt="썸네일"
                                        className="min-w-16 max-w-16 h-16 object-cover rounded-md"
                                    />
                                ) : (
                                    <div
                                        className="min-w-16 max-w-16 h-16 rounded-md bg-secondary flex items-center justify-center text-center text-secondary-foreground text-xs">
                                        등록된<br/>
                                        사진 없음
                                    </div>
                                )}

                                <div className="flex flex-col min-w-0">
                                    <div className="flex items-center gap-2 pe-20 min-w-0">
                                        <p className="font-semibold truncate flex-1 min-w-0">{item.title}</p>
                                        {/* 판매 상태 배지 */}
                                        {item.status && item.status !== "BEFORE_TRADE" && (
                                            <>
                                                {item.status === "PENDING_TRADE" && (
                                                    <span
                                                        className="mb-1 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded-full shadow-sm flex-shrink-0">
                                                    예약중
                                                </span>
                                                )}
                                                {item.status === "AFTER_TRADE" && (
                                                    <span
                                                        className="px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded-full shadow-sm flex-shrink-0">
                                                    거래완료
                                                </span>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    <p className="text-xs italic text-gray-600 dark:text-gray-400">
                                        {item.type === "SELL" ? (item.price && item.price! > 0 ? `${formatPrice(item.price)}원` : "무료 나눔") : "삽니다"}
                                    </p>
                                </div>
                                {item.status && item.status !== "AFTER_TRADE" &&
                                    <>
                                        {/* 찜 카운트 */}
                                        <div
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                if (item.id != null) {
                                                    potListApi.toggleLike(item.id).then(() => {
                                                        fetchBookmarkPotLists();
                                                        setBookmarkCount(item.id!, item.bookmarkCount! - 1);
                                                        setBookmarkCountOnDetail(item.bookmarkCount! - 1);
                                                        setOtherPotBookmarkCount(item.id!, item.bookmarkCount! - 1);
                                                    });
                                                }
                                            }}
                                            className="absolute top-1 right-2 z-20 hover:bg-gray-200 transition bg-white backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 text-sm">
                                            <Heart className="w-4 h-4 text-red-500" fill="red"/>
                                            <span className="font-medium">{item.bookmarkCount}</span>
                                        </div>

                                        {/* 채팅방 카운트 */}
                                        <div
                                            className="absolute top-9 right-2 z-20 bg-white/80 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 text-sm shadow-sm">
                                            <MessageCircle className="w-4 h-4 text-green-700" fill="green"/>
                                            <span className="font-medium">{item.chatroomCount}</span>
                                        </div>
                                    </>
                                }
                            </div>
                        ))}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
