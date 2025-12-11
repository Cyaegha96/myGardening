// DiaryPage.tsx

import PolaroidCard from "@/entities/myPlant/ui/PolaroidCard.tsx";
import { useState } from "react";
import type { DiaryPageProps } from "@/entities/myPlant/diary/model/DiaryPageProps.ts";
import { MoreVertical, Sun, Cloud, CloudRain, Snowflake } from "lucide-react";

export default function DiaryPage({ diary, onEdit, onDelete }: DiaryPageProps) {

    if (!diary) {
        return (
            <div className="h-[150px] flex justify-center items-center text-gray-400 text-sm">
                작성된 일지가 없습니다.
            </div>
        );
    }

    const [menuOpen, setMenuOpen] = useState(false);

    const formattedDate = diary.createdAt
        ? new Date(diary.createdAt).toLocaleDateString("ko-KR")
        : "";

    const handleDeleteClick = () => {
        setMenuOpen(false);
        onDelete(diary.diaryId);
    };

    // WeatherType enum 기반 아이콘 매핑
    const weatherIcon = (() => {
        switch (diary.weather) {
            case "SUNNY":
                return <Sun size={14} className="text-yellow-500" />;
            case "CLOUDY":
                return <Cloud size={14} className="text-gray-500" />;
            case "RAINY":
                return <CloudRain size={14} className="text-blue-500" />;
            case "SNOWY":
                return <Snowflake size={14} className="text-blue-400" />;
            default:
                return null;
        }
    })();

    return (
        <div className="mb-6 relative px-4">

            {/* 날짜 + 날씨 + 메뉴 */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">{formattedDate}</span>

                    {/* 날씨 아이콘 (있을 때만) */}
                    {weatherIcon}
                </div>

                <button
                    type="button"
                    onClick={() => setMenuOpen(prev => !prev)}
                    className="p-1 rounded hover:bg-gray-200"
                >
                    <MoreVertical size={16}/>
                </button>

                {menuOpen && (
                    <div className="absolute right-0 mt-6 w-24 bg-white border rounded shadow text-xs z-50">
                        <button
                            className="block w-full px-3 py-2 text-left hover:bg-gray-100"
                            onClick={() => {
                                setMenuOpen(false);
                                onEdit();
                            }}>
                            수정
                        </button>
                        <button
                            className="block w-full px-3 py-2 text-left text-red-500 hover:bg-red-50"
                            onClick={handleDeleteClick}>
                            삭제
                        </button>
                    </div>
                )}
            </div>

            {/* 이미지 / 내용 */}
            {diary.imageUrl ? (
                <div className="flex justify-center">
                    <PolaroidCard
                        type="diary"
                        variant="tape"
                        width="280px"
                        imageUrl={diary.imageUrl}
                        lines={(diary.content ?? "").split("\n")}
                    />
                </div>
            ) : (
                <p className="whitespace-pre-wrap text-gray-700 text-sm leading-normal px-1">
                    {diary.content}
                </p>
            )}
        </div>
    );
}
