// RightPageWidget.tsx
// 오른쪽 책 페이지: 하나의 "페이지"에 여러 다이어리 블록 표시

import { useState } from "react";
import type { RightPageWidgetProps } from "./RightPageWidgetProps";
import { Button } from "@/shared/shadcn/components/ui/button";
import { CalendarIcon } from "lucide-react";
import DiaryPage from "@/entities/myPlant/diary/ui/DiaryPage";
import DiaryCalendarPopup from "@/entities/myPlant/diary/ui/DiaryCalendarPopup";

export default function RightPageWidget({
                                            diariesOnPage,         // 현재 페이지에 표시될 다이어리 배열 (UI 배치 기준)
                                            pageIdx,
                                            totalPages,
                                            hasNext,
                                            onNext,
                                            onOpenWrite,
                                            onSelectDate,
                                            onEditDiary,
                                            onDeleteDiary,
                                        }: RightPageWidgetProps) {

    const [openCalendar, setOpenCalendar] = useState(false);

    // 페이지 번호 표시 - 현재 페이지 / 전체 페이지
    const pageNumber = totalPages > 0 ? `${pageIdx + 1} / ${totalPages}` : "0 / 0";

    // 현재 페이지에서 첫 번째 다이어리 (달력 선택 이동 기준)
    const firstDiary = diariesOnPage.length > 0 ? diariesOnPage[0] : null;

    return (
        <section
            className="w-full sm:w-1/2 h-[750px] overflow-visible
            bg-[url('/assets/diary-paper-a.png')] bg-cover bg-center
            p-10 relative"
            style={{ pointerEvents: 'auto' }}
        >

            {/* 다이어리 블록 리스트 */}
            <div className="flex flex-col gap-8 mt-10">
                {diariesOnPage.length > 0 ? (
                    diariesOnPage
                        .slice() // 원본 배열 보호
                        .reverse() // 최신순 아래 배치 (위쪽이 오래된 글, 아래로 갈수록 최신)
                        .map((d) => (
                            <DiaryPage
                                key={d.diaryId}
                                diary={d}
                                onEdit={() => onEditDiary(d)}
                                onDelete={() => onDeleteDiary(d.diaryId)}
                            />
                        ))
                ) : (
                    <DiaryPage diary={null} />
                )}
            </div>

            {/* 페이지 번호 표시 */}
            <div
                className="absolute bottom-3 left-1/2 -translate-x-1/2
                px-3 py-1 bg-white/80 rounded-full
                text-xs shadow-md z-40"
            >
                {pageNumber}
            </div>

            {/* 달력 버튼 (다이어리가 존재할 때만 표시) */}
            {firstDiary && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-16 z-50 text-gray-600 hover:text-gray-800"
                    onClick={() => setOpenCalendar((prev) => !prev)}
                >
                    <CalendarIcon size={18} />
                </Button>
            )}

            {/* 달력 팝업 */}
            {openCalendar && firstDiary?.createdAt && (
                <DiaryCalendarPopup
                    selectedDate={new Date(firstDiary.createdAt)}
                    onSelect={(date) => {
                        onSelectDate(date);
                        setOpenCalendar(false);
                    }}
                    onClose={() => setOpenCalendar(false)}
                />
            )}

            {/* 다음 페이지 버튼 */}
            <Button
                variant="outline"
                size="icon"
                disabled={!hasNext}
                onClick={onNext}
                className="absolute bottom-6 right-10 z-30"
            >
                ▶
            </Button>

            {/* 다이어리 작성 버튼 */}
            {/* 변경: handleWriteComplete 제거, 상위에서 onOpenWrite만 호출 */}
            <Button
                variant="default"
                onClick={() => onOpenWrite()}
                className="absolute bottom-6 right-28 z-30"
            >
                작성
            </Button>
        </section>
    );
}
