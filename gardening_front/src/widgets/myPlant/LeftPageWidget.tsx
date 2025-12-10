import type { LeftPageWidgetProps } from "./LeftPageWidgetProps";
import { Button } from "@/shared/shadcn/components/ui/button";

export default function LeftPageWidget({
                                           plant,
                                           pageIdx,
                                           hasPrev,
                                           onPrev,
                                           onOpenChangeImage,
                                           onOpenHistory,
                                       }: LeftPageWidgetProps) {
    return (
        <section
            className="w-full sm:w-1/2 h-[750px] overflow-visible
                bg-[url('/assets/diary-paper-a.png')] bg-cover
                p-10 relative
                "
            style={{ pointerEvents: 'auto' }}
        >
            {plant?.url ? (
                <img
                    src={plant.url}
                    alt="대표 이미지"
                    className="w-full h-[500px] object-cover border rounded-xl shadow"
                />
            ) : (
                <div className="w-full h-[500px] bg-gray-100 border flex items-center justify-center rounded-lg text-gray-400">
                    No Image
                </div>
            )}

            <h2 className="mt-6 text-2xl font-bold text-[#5a4736]">
                {plant?.nickname}
            </h2>
            <p className="text-green-700 font-semibold text-sm">
                {plant?.commonName}
            </p>

            {/* 대표 이미지 & 히스토리 버튼 */}
            <div className="mt-5 flex justify-center gap-3">
                <Button size="sm" variant="default" onClick={onOpenChangeImage}>
                    대표 이미지 변경
                </Button>
                <Button size="sm" variant="outline" onClick={onOpenHistory}>
                    히스토리
                </Button>
            </div>

            {/* Prev 버튼 (책 왼쪽 아래) */}
            <Button
                variant="outline"
                size="icon"
                disabled={!hasPrev}
                onClick={onPrev}
                className="absolute bottom-6 left-6 z-100"
            >
                ◀
            </Button>
        </section>
    );
}
