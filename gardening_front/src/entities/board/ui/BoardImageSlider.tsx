import { useState } from "react";

interface BoardImageSliderProps {
    images: string[];     // 이미지 URL 리스트
    fallback?: string;    // 이미지 없는 경우 대체 이미지
}

export default function BoardImageSlider({ images, fallback }: BoardImageSliderProps) {
    const [current, setCurrent] = useState(0);

    // 이미지가 완전히 없고 fallback도 없다면 → 컴포넌트 렌더링 안 함
    if (images.length === 0 && !fallback) {
        return null;
    }

    const nextImage = () =>
        setCurrent(prev => (prev + 1) % images.length);

    const prevImage = () =>
        setCurrent(prev => (prev - 1 + images.length) % images.length);

    const displayImage = images.length > 0 ? images[current] : fallback!;

    return (
        <div className="w-full flex justify-center mb-4 relative">
            <div className="w-[90%] rounded-md overflow-hidden relative">

                <img
                    src={displayImage}
                    alt="board image"
                    className="w-full aspect-square object-cover transition-all duration-300"
                />

                {/* 좌우 버튼 */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-2 hover:bg-black/60 transition"
                        >
                            {"<"}
                        </button>

                        <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-2 hover:bg-black/60 transition"
                        >
                            {">"}
                        </button>
                    </>
                )}

                {/* dot indicator */}
                {images.length > 1 && (
                    <div className="absolute bottom-3 w-full flex justify-center gap-2">
                        {images.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-2 h-2 rounded-full transition ${
                                    idx === current ? "bg-white" : "bg-white/40"
                                }`}
                            ></div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}