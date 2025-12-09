import { ChevronLeft, ChevronRight } from "lucide-react";

export default function DiaryNavigation({ pageIdx, maxPage, onPrev, onNext }) {
    return (
        <>
            {/* 왼쪽 아래 Prev */}
            <button
                onClick={onPrev}
                disabled={pageIdx === 0}
                className="absolute left-4 bottom-6 p-2 rounded-full bg-white/70 shadow
                           hover:bg-white disabled:opacity-30 transition"
            >
                <ChevronLeft />
            </button>

            {/* 오른쪽 아래 Next */}
            <button
                onClick={onNext}
                disabled={pageIdx === maxPage}
                className="absolute right-4 bottom-6 p-2 rounded-full bg-white/70 shadow
                           hover:bg-white disabled:opacity-30 transition"
            >
                <ChevronRight />
            </button>
        </>
    );
}
