import {useState} from "react";

interface BoardImageSliderProps {
    images: string[];
    fallback?: string;
}

export default function BoardImageSlider({images, fallback}: BoardImageSliderProps) {
    const [current, setCurrent] = useState(0);

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
            <div
                className="
                            relative
                            overflow-hidden
                            rounded-md
                            flex
                            justify-center
                            items-center
                            w-[90%]
                            mx-auto
                        "
            >
                <img
                    src={displayImage}
                    alt="board image"
                    className="
                                w-full
                                h-auto
                                object-cover
                                object-center          /* 정중앙 기준으로 자르기 */
                                transition-all
                                duration-300
                            "
                />
            </div>

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
    );
}
