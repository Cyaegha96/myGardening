import {usePotDetailStore} from "@/entities/potList/model/potDetailStore.tsx";
import {createEditor} from "lexical";
import {$generateHtmlFromNodes} from '@lexical/html';
import React, {useEffect, useState} from "react";
import {nodes} from "@/shared/shadcn/components/editor/blocks/editor-x/nodes.ts"
import {Heart, MapPin} from "lucide-react";
import {usePotListStore} from "@/entities/potList/model/potListStore.ts";
import {potListApi} from "@/entities/potList/api/potListApi.ts";
import {formatPrice} from "@/entities/potList/libs/formatPrice.ts";
import {Dialog, DialogContent, DialogTrigger} from "@/shared/shadcn/components/ui/dialog.tsx";
import {getRelativeTime} from "@/shared/libs/getRelativeTime.ts";
import {type AddressParts, splitKoreanAddress} from "@/shared/libs/splitKoreanAddress.ts";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/shared/shadcn/components/ui/tooltip.tsx";

export default function PotDetailInfo() {
    const potDetail = usePotDetailStore(state => state.potDetail);
    const [descriptionHtml, setDescriptionHtml] = useState<string>("");
    const tagList = usePotListStore(state => state.tagFilterList);
    const fetchPotTagList = usePotListStore(state => state.fetchPotTagList);
    const bookmarkPotLists = usePotListStore(state => state.bookmarkPotLists);
    const fetchBookmarkPotLists = usePotListStore(state => state.fetchBookmarkPotLists);
    const setBookmarkCount = usePotDetailStore(state => state.setBookmarkCount);

    const [open, setOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const [addressParts, setAddressParts] = useState<AddressParts>();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 640); // Tailwind sm 기준
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (!potDetail?.description) return;

        try {
            const editor = createEditor({nodes});
            const json = JSON.parse(potDetail.description);

            editor.setEditorState(editor.parseEditorState(json))

            editor.update(() => {
                const html = $generateHtmlFromNodes(editor)
                setDescriptionHtml(html)
            })

        } catch (e) {
            console.error("description 변환 실패", e);
            setDescriptionHtml(potDetail.description); // fallback
        }
    }, [potDetail?.description]);

    useEffect(() => {
        if (tagList == null || tagList.length === 0) {
            fetchPotTagList();
        }
    }, [fetchPotTagList, tagList]);

    useEffect(() => {
        if (potDetail && potDetail.location) {
            setAddressParts(splitKoreanAddress(potDetail.location));
        }
    }, [potDetail, potDetail?.location]);

    if (!potDetail) return <div>로딩 중...</div>;

    return (
        <div className="relative space-y-6 p-4 md:p-6 bg-white rounded-lg shadow-sm h-full overflow-hidden">
            <div className="flex justify-between items-center mb-2 grid grid-cols-3">
                <div className="col-span-2 flex items-center gap-2">
                    <p className="text-2xl font-semibold text-gray-900 truncate">
                        제목
                    </p>
                    <span className="text-sm text-muted-foreground flex-shrink-0">
                        {getRelativeTime(potDetail.bumpedAt!)}
                    </span>
                </div>
                <div className="ms-3 flex items-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                        <span className="text-sm text-gray-500 inline-block max-w-full truncate">
                            {potDetail && potDetail.location
                                ? potDetail.location
                                : "거래지역 미지정"
                            }
                        </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{potDetail.location}</p>
                        </TooltipContent>
                    </Tooltip>


                    {potDetail.location && (
                        isMobile ?
                            (
                                <button
                                    type="button"
                                    className="p-1 rounded-full hover:bg-gray-200 transition"
                                    onClick={() => {
                                        window.open(`https://map.naver.com/p/search/${encodeURIComponent(potDetail.location ?? "")}`, "_blank");
                                    }}
                                >
                                    <MapPin className="w-5 h-5 text-primary"/>
                                </button>
                            )
                            :
                            (
                                <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogTrigger asChild>
                                        <button
                                            type="button"
                                            className="p-1 rounded-full hover:bg-gray-200 transition"
                                        >
                                            <MapPin className="w-5 h-5 text-primary"/>
                                        </button>
                                    </DialogTrigger>

                                    <DialogContent
                                        className="md:max-w-[100vw] md:max-h-[100vh] w-[80vw] h-[80vh] p-0">
                                        <iframe
                                            title="naver-map"
                                            src={`https://map.naver.com/p/search/${encodeURIComponent(potDetail.location ?? "")}`}
                                            width="100%"
                                            height="100%"
                                            className="rounded-lg"
                                        />
                                    </DialogContent>
                                </Dialog>
                            )
                    )}
                </div>
            </div>

            {/* 가격 */}
            <p className="mb-3 text-3xl font-bold text-primary">{potDetail.type === "SELL" ? (potDetail.price && potDetail.price! > 0 ? `${formatPrice(potDetail.price)}원` : "무료 나눔") : "삽니다"}</p>

            {/* 판매 상태 */}
            {potDetail.status && potDetail.status !== "BEFORE_TRADE" && (
                <div className="absolute left-2 top-2 z-20">
                    {potDetail.status === "PENDING_TRADE" && (
                        <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded-full shadow-sm">
                                예약중
                            </span>
                    )}

                    {potDetail.status === "AFTER_TRADE" && (
                        <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded-full shadow-sm">
                                거래완료
                            </span>
                    )}
                </div>
            )}

            {/* 내용 */}
            <div
                className="prose max-w-full h-[300px] md:h-[400px] bg-gray-50 p-4 rounded-md border border-gray-200 text-gray-800 shadow-sm mb-2 overflow-y-auto break-words"
                dangerouslySetInnerHTML={{__html: descriptionHtml}}
            />

            {/* 태그 */}
            <div className="overflow-x-auto h-[20px] md:h-[43px] flex gap-2 mb-5">
                {tagList.flatMap(cat => cat.tagList)
                    .filter(tag => potDetail.tags.includes(tag.tagId!))
                    .map(tag => (
                        <div
                            key={tag.tagId}
                            className="h-5 md:h-7 bg-secondary text-background-foreground px-2 py-1 rounded-full text-sm flex-shrink-0 flex items-center gap-1"
                        >
                            {tag.tagName}
                        </div>
                    ))
                }
            </div>

            {/* 상세 정보 */}
            <div className="text-sm text-muted-foreground m-0">
                {`채팅 ${potDetail.chatroomCount}·찜 ${potDetail.bookmarkCount}·조회 ${potDetail.viewCount}`}
            </div>

            <div className="mt-1 grid grid-cols-10 gap-2 flex items-center justify-center">
                <div
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (potDetail.id != null) {
                            potListApi.toggleLike(potDetail.id).then(() => {
                                fetchBookmarkPotLists();
                                bookmarkPotLists.some(item => item.id === potDetail.id) ?
                                    setBookmarkCount(potDetail.bookmarkCount! - 1)
                                    :
                                    setBookmarkCount(potDetail.bookmarkCount! + 1);
                            });
                        }
                    }}
                    className="group col-span-1 transition bg-white p-1 backdrop-blur-md rounded-full flex justify-center items-center gap-1">
                    <Heart
                        className={
                            `w-10 h-10 text-red-500
                            ${bookmarkPotLists.some(item => item.id === potDetail.id) ? "" : "transition group-hover:fill-gray-200"}`
                        }
                        fill={
                            bookmarkPotLists.some(item => item.id === potDetail.id) ? "red" : "transparent"
                        }
                    />
                </div>
                <div className="col-span-9">
                    <button
                        onClick={() => {
                            // 채팅 시작 로직
                            alert("채팅 시작 클릭!");
                        }}
                        className="w-full py-3 bg-secondary hover:bg-accent/50 text-secondary-foreground font-semibold rounded-lg shadow-md transition-colors cursor-pointer"
                    >
                        채팅 시작
                    </button>
                </div>
            </div>
        </div>
    );
}
