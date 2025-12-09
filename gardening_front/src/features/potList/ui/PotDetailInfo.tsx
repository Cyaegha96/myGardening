import {usePotDetailStore} from "@/entities/potList/model/potDetailStore.ts";
import {createEditor} from "lexical";
import {$generateHtmlFromNodes} from '@lexical/html';
import {useEffect, useState} from "react";
import {nodes} from "@/shared/shadcn/components/editor/blocks/editor-x/nodes.ts"
import {Heart, MapPin, MoreVertical, Siren} from "lucide-react";
import {usePotListStore} from "@/entities/potList/model/potListStore.ts";
import {potListApi} from "@/entities/potList/api/potListApi.ts";
import {formatPrice} from "@/entities/potList/libs/formatPrice.ts";
import {Dialog, DialogContent, DialogTrigger} from "@/shared/shadcn/components/ui/dialog.tsx";
import {getRelativeTime} from "@/shared/libs/getRelativeTime.ts";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/shared/shadcn/components/ui/tooltip.tsx";
import useUserStore from "@/app/store/userStore.ts";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from "@/shared/shadcn/components/ui/dropdown-menu.tsx";
import {usePotListWriteStore} from "@/entities/potList/model/potListWriteStore.ts";
import type {PotListResponseDTO} from "@/shared/api";
import {useNavigate} from "react-router-dom";
import {Button} from "@/shared/shadcn/components/ui/button.tsx";

export default function PotDetailInfo() {
    const potDetail = usePotDetailStore(state => state.potDetail);
    const images = usePotDetailStore(state => state.images);
    const [descriptionHtml, setDescriptionHtml] = useState<string>("");
    const tagList = usePotListStore(state => state.tagFilterList);
    const fetchPotTagList = usePotListStore(state => state.fetchPotTagList);
    const bookmarkPotLists = usePotListStore(state => state.bookmarkPotLists);
    const fetchBookmarkPotLists = usePotListStore(state => state.fetchBookmarkPotLists);
    const setBookmarkCount = usePotDetailStore(state => state.setBookmarkCount);
    const submitReport = usePotDetailStore(state => state.submitReport);
    const [reportReason, setReportReason] = useState<string>("");
    const deletePot = usePotDetailStore(state => state.deletePot);
    const bumpPot = usePotDetailStore(state => state.bumpPot);
    const initialize = usePotListWriteStore(state => state.initialize);

    const setAfterTrade = usePotDetailStore(state => state.setAfterTrade);
    const setBeforeTrade = usePotDetailStore(state => state.setBeforeTrade);
    const setPendingTrade = usePotDetailStore(state => state.setPendingTrade);

    const setCursorId = usePotListStore(state => state.setCursorId);

    const userUid = useUserStore(state => state.uid);

    const [mapOpen, setMapOpen] = useState<boolean>(false);
    const [reportOpen, setReportOpen] = useState<boolean>(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [completeOpen, setCompleteOpen] = useState(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleEdit = () => {
        const data = new class implements PotListResponseDTO {
            potListDetailDTO = potDetail;
            potListImageDTOList = images;
        }
        initialize(data);
        navigate(`/pot-list/edit/${potDetail?.id}`);
    }

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

    if (!potDetail) return <div>로딩 중...</div>;

    return (
        <div className="relative space-y-6 p-4 md:p-6 bg-white rounded-lg shadow-sm h-full overflow-hidden">
            <div className="flex justify-between items-center mb-2 grid grid-cols-3">
                <div className="col-span-2 flex items-center gap-2">
                    <p className="text-2xl font-semibold text-gray-900 truncate">
                        {potDetail.title}
                    </p>
                    <span className="text-sm text-muted-foreground flex-shrink-0">
                        {(potDetail.bumpedAt && new Date(potDetail.bumpedAt) > new Date(potDetail.createdAt!) ? "끌올 " : "")
                            + getRelativeTime(potDetail.bumpedAt!)}
                    </span>
                </div>
                <div className="me-1 flex items-center justify-end gap-2">
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
                                    className="p-1 rounded-full cursor-pointer group"
                                    onClick={() => {
                                        window.open(`https://map.naver.com/p/search/${encodeURIComponent(potDetail.location ?? "")}`, "_blank");
                                    }}
                                >
                                    <MapPin
                                        className="w-5 h-5 transition fill-transparent group-hover:fill-gray-200 text-primary"/>
                                </button>
                            )
                            :
                            (
                                <Dialog open={mapOpen} onOpenChange={setMapOpen}>
                                    <DialogTrigger asChild>
                                        <button
                                            type="button"
                                            className="p-1 group rounded-full cursor-pointer"
                                        >
                                            <MapPin
                                                className="w-5 h-5 text-primary transition fill-transparent group-hover:fill-gray-200"/>
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
            <div className="flex justify-between items-center grid grid-cols-4 m-0">
                <p className="mb-3 text-3xl font-bold text-primary col-span-3">
                    {potDetail.type === "SELL" ? (potDetail.price && potDetail.price! > 0 ? `${formatPrice(potDetail.price)}원` : "무료 나눔") : "삽니다"}
                    {/* 판매 상태 */}
                    {potDetail.status && potDetail.status !== "BEFORE_TRADE" && (
                        <>
                            {potDetail.status === "PENDING_TRADE" && (
                                <span
                                    className="ms-2 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded-full shadow-sm">
                                예약중
                            </span>
                            )}

                            {potDetail.status === "AFTER_TRADE" && (
                                <span
                                    className="ms-2 px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded-full shadow-sm">
                                거래완료
                            </span>
                            )}
                        </>
                    )}
                </p>
                <div className="flex justify-end h-full">
                    {potDetail.writerUid !== userUid ? (
                            <Dialog open={reportOpen} onOpenChange={() => {
                                setReportOpen(!reportOpen);
                                setReportReason("");
                            }}>
                                <DialogTrigger asChild>
                                    <button
                                        type="button"
                                        className="flex item-start p-1 rounded-full transition group cursor-pointer"
                                    >
                                        <Siren
                                            className="w-6 h-6 transition text-destructive fill-transparent group-hover:fill-gray-200"/>
                                    </button>
                                </DialogTrigger>

                                <DialogContent className="w-full h-80 p-0">
                                    <div className="border-b px-4 py-3 flex items-center justify-between">
                                        <h2 className="text-xl font-semibold">신고하기</h2>
                                    </div>

                                    <div className="flex-1 overflow-y-auto px-4 flex flex-col gap-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-medium">신고 사유</label>
                                            <textarea
                                                className="w-full h-32 p-3 border rounded-lg bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                                placeholder="신고 사유를 상세히 입력해주세요..."
                                                value={reportReason}
                                                onChange={(e) => setReportReason(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="border-t px-4 py-3 flex justify-end gap-2 bg-white">
                                        <button
                                            type="button"
                                            disabled={!reportReason.trim()}
                                            className="px-4 rounded-md bg-destructive text-white hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={() => {
                                                submitReport(reportReason);
                                                setReportOpen(false);
                                            }}
                                        >
                                            신고 제출
                                        </button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        )
                        :
                        (potDetail.status !== "AFTER_TRADE" &&
                            <div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button
                                            className="p-2 rounded hover:bg-gray-100 cursor-pointer focus:outline-none">
                                            <MoreVertical className="text-primary"/>
                                        </button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent>
                                        <DropdownMenuSub>
                                            <DropdownMenuSubTrigger>
                                                상태 수정
                                            </DropdownMenuSubTrigger>
                                            <DropdownMenuSubContent>
                                                {potDetail.status !== "BEFORE_TRADE" &&
                                                    <DropdownMenuItem onClick={setBeforeTrade}>
                                                        거래중
                                                    </DropdownMenuItem>
                                                }

                                                {potDetail.status !== "PENDING_TRADE" &&
                                                    <DropdownMenuItem onClick={setPendingTrade}>
                                                        거래예약
                                                    </DropdownMenuItem>
                                                }
                                                <DropdownMenuItem onClick={() => setCompleteOpen(true)}>
                                                    거래완료
                                                </DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuSub>

                                        <DropdownMenuItem onClick={bumpPot}>
                                            끌어올리기
                                        </DropdownMenuItem>

                                        <DropdownMenuItem onClick={handleEdit}>
                                            수정
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            className="text-destructive"
                                            onClick={() => setDeleteOpen(true)}
                                        >
                                            삭제
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                        )
                    }
                </div>
            </div>

            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent className="w-full max-w-sm p-6">
                    <h2 className="text-xl font-semibold text-destructive mb-4">
                        정말 삭제하시겠습니까?
                    </h2>

                    <p className="text-sm text-muted-foreground mb-6">
                        삭제하면 다시 복구할 수 없습니다.
                    </p>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition"
                            onClick={() => setDeleteOpen(false)}
                        >
                            취소
                        </button>

                        <button
                            type="button"
                            className="px-4 py-2 rounded-md bg-destructive text-white hover:bg-red-600 transition"
                            onClick={() => {
                                deletePot();
                                setCursorId(undefined);
                                navigate("/pot-list");
                            }}
                        >
                            삭제하기
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={completeOpen} onOpenChange={setCompleteOpen}>
                <DialogContent className="w-full max-w-sm p-6">
                    <h2 className="text-xl font-semibold text-primary mb-4">
                        정말 거래가 완료되었습니까?
                    </h2>

                    <p className="text-sm text-muted-foreground mb-6">
                        완료된 거래는 수정 및 삭제가 불가하게 됩니다.
                    </p>

                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setCompleteOpen(false)}
                        >
                            취소
                        </Button>

                        <Button
                            variant="default"
                            onClick={() => {
                                setAfterTrade();
                                setCompleteOpen(false);
                            }}
                        >
                            거래완료
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* 내용 */}
            <div
                className="prose max-w-full h-[300px] md:h-[400px] bg-gray-50 p-4 rounded-md border border-gray-200 text-gray-800 shadow-sm mb-2 overflow-y-auto break-words"
                dangerouslySetInnerHTML={{__html: descriptionHtml}}
            />

            {/* 태그 */}
            <div className="overflow-x-auto h-[20px] md:h-[43px] flex gap-2 mb-5">
                {tagList.flatMap(cat => cat.tagList)
                    .filter(tag => potDetail.tags!.includes(tag.tagId!))
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

            <div className="mt-2 mb-0 grid grid-cols-10 gap-2 flex items-center justify-center">
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
                    <Button
                        onClick={() => {
                            // 채팅 시작 로직
                            alert("채팅 시작 클릭!");
                        }}
                        className="w-full p-0 bg-secondary hover:bg-accent/50 text-secondary-foreground font-semibold rounded-lg shadow-md transition-colors cursor-pointer"
                        disabled={potDetail.status === "AFTER_TRADE"}
                    >
                        채팅 시작
                    </Button>
                </div>
            </div>
        </div>
    );
}
