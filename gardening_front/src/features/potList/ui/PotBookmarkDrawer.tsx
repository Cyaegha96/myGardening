import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,} from "@/shared/shadcn/components/ui/sheet";
import {Button} from "@/shared/shadcn/components/ui/button";
import {Heart, MessageCircle} from "lucide-react";
import {useEffect, useState} from "react";
import {usePotListStore} from "@/entities/potList/model/potListStore.ts";
import {potListApi} from "@/entities/potList/api/potListApi.ts";

export default function PotBookmarkDrawer() {
    const [isSheetOpen, setSheetOpen] = useState<boolean>(false);

    const fetchBookmarkPotLists = usePotListStore(state => state.fetchBookmarkPotLists);
    const fetchPotList = usePotListStore(state => state.fetchPotList);
    const bookmarkPotLists = usePotListStore(state => state.bookmarkPotLists);

    useEffect(() => {
        fetchBookmarkPotLists();
    }, []);

    return (
        <div>
            <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                    <div className="fixed bottom-40 right-6 md:bottom-46 md:right-8 z-50">
                        <Button
                            className="cursor-pointer relative bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg w-14 h-14 md:w-16 md:h-16 transition-transform hover:scale-105">
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
                    <div className="space-y-2 overflow-auto">
                        {bookmarkPotLists.length === 0 && (
                            <p className="text-sm text-gray-500">찜 한 분양글이 없습니다.</p>
                        )}

                        {bookmarkPotLists.map((item, idx) => (
                            <div
                                key={idx}
                                className={`relative flex items-center gap-3 p-2 rounded-lg 
                                bg-green-50 dark:bg-green-900 hover:bg-green-100 dark:hover:bg-green-800 
                                cursor-pointer transition m-1 truncate`}
                                onClick={() => {
                                    alert(item.id + "로 이동");
                                    setSheetOpen(false);
                                }}
                            >
                                <img
                                    src={item.thumbnail}
                                    className="w-16 h-16 object-cover rounded"
                                    alt={item.title}
                                />
                                <div className="flex flex-col min-w-0">
                                    <p className="font-semibold truncate w-full">{item.title}</p>
                                    <p className="text-xs italic text-gray-600 dark:text-gray-400">
                                        {item.price}원
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
                                                        fetchPotList();
                                                    });
                                                }
                                            }}
                                            className="absolute top-1 right-2 z-20 hover:bg-gray-200 transition bg-white backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 text-sm shadow-sm">
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
