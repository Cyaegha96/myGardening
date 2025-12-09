import { useCallback, useEffect, useMemo, useState } from "react";
import {
    MyPlantControllerApi,
    MyPlantDiaryControllerApi,
    type MyPlantDiaryResponseDTO,
    type MyPlantResponseDTO,
    MyPlantDiaryDTOWeatherEnum,
} from "@/shared/api";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import LeftPageWidget from "@/widgets/myPlant/LeftPageWidget";
import RightPageWidget from "@/widgets/myPlant/RightPageWidget";
import ImageHistoryModal from "@/entities/myPlant/diary/ui/ImageHistoryModal";
import DiaryWriteModal from "@/features/myPlant/diary/create-diary/ui/DiaryWriteModal";

export default function PlantDetailPage() {
    const { userPlantId } = useParams();
    const plantId = userPlantId ? Number(userPlantId) : null;

    const api = new MyPlantControllerApi();
    const diaryApi = new MyPlantDiaryControllerApi();

    // 식물 정보
    const [plant, setPlant] = useState<MyPlantResponseDTO | null>(null);

    // 다이어리 전체 목록
    const [diaries, setDiaries] = useState<MyPlantDiaryResponseDTO[]>([]);

    // 페이지 index (최신 다이어리가 0페이지)
    const [pageIdx, setPageIdx] = useState(0);

    // 페이지 넘김 애니메이션 상태
    const [isFlipping, setIsFlipping] = useState(false);
    const [flipDirection, setFlipDirection] = useState<"next" | "prev" | null>(null);

    // 모달 상태
    const [openWriteModal, setOpenWriteModal] = useState(false);
    const [editTargetDiary, setEditTargetDiary] = useState<MyPlantDiaryResponseDTO | null>(null);
    const [openHistory, setOpenHistory] = useState(false);

    // 식물 정보 로드
    const loadPlant = useCallback(async () => {
        if (!plantId) return;
        const res = await api.getMyPlant(plantId);
        setPlant(res.data);
    }, [plantId]);

    // 다이어리 로딩 (백엔드에서 전체 목록 한 번에 내려줌, 최신순 정렬)
    const loadDiaries = useCallback(async () => {
        if (!plantId) return;

        const res = await diaryApi.getDiaryList(plantId);
        const list = res.data ?? [];

        setDiaries(list);
    }, [plantId]);

    useEffect(() => {
        loadPlant();
        loadDiaries();
    }, [loadPlant, loadDiaries]);

    // 페이지 내 Diary 배치 (동적 높이)
    const paginatedDiaries = useMemo(() => {
        const PAGE_MAX_HEIGHT = 500;
        const pages: MyPlantDiaryResponseDTO[][] = [];
        let current: MyPlantDiaryResponseDTO[] = [];
        let currentHeight = 0;

        diaries.forEach(diary => {
            const estimatedHeight = diary.imageUrl ? 350 : 150;

            if (currentHeight + estimatedHeight > PAGE_MAX_HEIGHT) {
                pages.push(current);
                current = [];
                currentHeight = 0;
            }

            current.push(diary);
            currentHeight += estimatedHeight;
        });

        if (current.length > 0) pages.push(current);

        return pages;
    }, [diaries]);

    const totalPages = paginatedDiaries.length;
    const currentPageItems = paginatedDiaries[pageIdx] ?? [];

    // 변경: 페이지 수 변화에 따라 pageIdx를 자동 보정 (데이터가 줄어들어도 사라지지 않도록)
    useEffect(() => {
        if (pageIdx > totalPages - 1) {
            setPageIdx(Math.max(totalPages - 1, 0));
        }
    }, [pageIdx, totalPages]);

    // 종이 넘김 애니메이션
    const playFlip = async (direction: "next" | "prev") => {
        if (isFlipping) return;

        setIsFlipping(true);
        setFlipDirection(direction);

        await new Promise(res => setTimeout(res, 450)); // Soft Flip 시간

        direction === "next"
            ? setPageIdx(i => Math.min(i + 1, totalPages - 1))
            : setPageIdx(i => Math.max(i - 1, 0));

        setFlipDirection(null);
        setIsFlipping(false);
    };

    const goToNext = async () => {
        if (pageIdx >= totalPages - 1) return;
        await playFlip("next");
    };

    const goToPrev = async () => {
        if (pageIdx <= 0) return;
        await playFlip("prev");
    };

    // 삭제 처리
    const handleDelete = async (diaryId: number) => {
        if (!plantId) return;

        await diaryApi.deleteDiary(plantId, diaryId);
        toast.success("삭제되었습니다.");
        await loadDiaries();
        // pageIdx 보정은 위 useEffect에서 totalPages 변경에 따라 자동 처리
    };

    // 특정 날짜로 이동
    const handleSelectDate = (date: Date) => {
        if (!diaries.length) return;

        const idx = diaries.findIndex(d =>
            d.createdAt
                ? new Date(d.createdAt).toDateString() === date.toDateString()
                : false
        );

        // 주의: 여기서는 일단 "해당 인덱스를 페이지 index처럼" 사용하고 있음
        // 높이 기반 페이지에서 정확히 페이지를 찾으려면, 추후 같은 알고리즘으로 페이지 인덱스를 역산해야 함
        if (idx >= 0) {
            setPageIdx(idx);
        } else {
            toast.info("해당 날짜의 일지는 없습니다.");
        }
    };

    // 저장 / 수정
    const handleSaveDiary = async ({
                                       content,
                                       weather,
                                       file,
                                   }: {
        content: string;
        weather: string;
        file: File | null;
    }) => {
        if (!plantId) return;

        try {
            const convertedWeather = weather
                ? (weather as MyPlantDiaryDTOWeatherEnum)
                : undefined;

            if (editTargetDiary) {
                await diaryApi.updateDiary(
                    plantId,
                    editTargetDiary.diaryId,
                    { content, weather: convertedWeather },
                    file ?? undefined
                );
            } else {
                await diaryApi.insertDiary(
                    plantId,
                    { content, weather: convertedWeather },
                    file ?? undefined
                );
            }

            toast.success("저장되었습니다.");
            setOpenWriteModal(false);

            // 변경: 전체 다이어리 새로 로드 후
            await loadDiaries();

            // 변경: 항상 최신 페이지(0번 페이지)로 이동
            setPageIdx(0);

        } catch (err) {
            console.error(err);
            toast.error("저장에 실패했습니다.");
        }
    };

    return (
        <main className="w-full max-w-[1300px] mx-auto py-10 flex justify-center relative">
            <div
                className="flex w-full shadow-2xl rounded-2xl overflow-hidden relative border border-[#d9d3c7]"
                style={{
                    perspective: "2000px",
                    transform: `translateX(${pageIdx * -3}px)`
                }}
            >

                {/* 왼쪽 페이지 */}
                <LeftPageWidget
                    id="leftPage"
                    plant={plant}
                    pageIdx={pageIdx}
                    isFlipping={isFlipping && flipDirection === "prev"}
                    transformStyle={flipDirection === "prev"
                        ? { transform: "rotateY(180deg)", transformOrigin: "right center" }
                        : undefined}
                    hasPrev={pageIdx > 0}
                    onPrev={goToPrev}
                    onOpenChangeImage={() => toast.info("준비 중입니다.")}
                    onOpenHistory={() => setOpenHistory(true)}
                />

                {/* 오른쪽 페이지 */}
                <RightPageWidget
                    id="rightPage"
                    diariesOnPage={currentPageItems}
                    pageIdx={pageIdx}
                    totalPages={totalPages}
                    hasNext={pageIdx < totalPages - 1}
                    isFlipping={isFlipping && flipDirection === "next"}
                    transformStyle={flipDirection === "next"
                        ? { transform: "rotateY(-180deg)", transformOrigin: "left center" }
                        : undefined}
                    onNext={goToNext}
                    onOpenWrite={() => {
                        setEditTargetDiary(null);
                        setOpenWriteModal(true);
                    }}
                    onSelectDate={handleSelectDate}
                    onEditDiary={(d) => {
                        setEditTargetDiary(d);
                        setOpenWriteModal(true);
                    }}
                    onDeleteDiary={handleDelete}
                />
            </div>

            {openHistory && (
                <ImageHistoryModal
                    userPlantId={plantId ?? 0}
                    onClose={() => setOpenHistory(false)}
                    onSuccess={loadPlant}
                />
            )}

            {openWriteModal && (
                <DiaryWriteModal
                    userPlantId={plantId ?? 0}
                    diary={editTargetDiary}
                    onClose={() => setOpenWriteModal(false)}
                    onSubmit={handleSaveDiary}
                    onSuccess={loadDiaries}
                />
            )}
        </main>
    );
}
