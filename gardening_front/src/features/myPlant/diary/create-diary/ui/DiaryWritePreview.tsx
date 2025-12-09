import { Sun, Cloud, CloudRain, Snowflake } from "lucide-react";
import type { DiaryWritePreviewProps } from "@/features/myPlant/diary/create-diary/model/DiaryWritePreviewProps.ts";

export default function DiaryWritePreview({
                                              content,
                                              weather,
                                              imagePreview,
                                          }: DiaryWritePreviewProps) {

    const formattedDate = new Date().toLocaleDateString("ko-KR");

    const weatherIcons: Record<string, JSX.Element> = {
        SUNNY: <Sun size={18} className="text-yellow-500" />,
        CLOUDY: <Cloud size={18} className="text-gray-500" />,
        RAINY: <CloudRain size={18} className="text-blue-500" />,
        SNOWY: <Snowflake size={18} className="text-sky-400" />,
    };

    const WeatherAndDate = (
        <div className="flex items-center gap-2 text-xs text-gray-600">
            <span>{formattedDate}</span>
            {weather && <span>{weatherIcons[weather]}</span>}
        </div>
    );

    return (
        <div className="w-full h-full p-4 bg-[#f6f3e9] rounded-md border border-gray-300 shadow-sm">

            {/* ★ 사진 있을 때 */}
            {imagePreview !== "noImage" && (
                <>
                    <div className="mb-3">{WeatherAndDate}</div>

                    <div className="w-full bg-white shadow-lg border border-gray-300 rounded-lg p-2 mb-4">
                        <img
                            src={imagePreview}
                            className="
                                w-full
                                h-auto
                                max-h-[45vh]
                                object-contain
                                rounded-sm
                            "
                        />

                        {content && (
                            <p className="text-[12px] text-gray-700 text-center mt-2 whitespace-pre-wrap">
                                {content}
                            </p>
                        )}
                    </div>
                </>
            )}

            {/* ★ 사진 없을 때 */}
            {imagePreview === "noImage" && (
                <>
                    {WeatherAndDate}

                    {content && (
                        <p className="mt-4 whitespace-pre-wrap text-sm text-gray-700">
                            {content}
                        </p>
                    )}
                </>
            )}
        </div>
    );
}
