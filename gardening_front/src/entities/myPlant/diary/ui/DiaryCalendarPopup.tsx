import { ChevronLeft, ChevronRight } from "lucide-react";
import {useState} from "react";
import type {DiaryCalendarPopupProps} from "@/entities/myPlant/diary/model/DiaryCalendarPopupProps.ts";

export default function DiaryCalendarPopup({
                                               selectedDate,
                                               onSelect,
                                               onClose,
                                           }: DiaryCalendarPopupProps) {
    const today = new Date();
    const [current, setCurrent] = useState(selectedDate);

    const year = current.getFullYear();
    const month = current.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const prevMonth = () => setCurrent(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrent(new Date(year, month + 1, 1));

    const isSameDate = (a: Date, b: Date) =>
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();

    const handleSelect = (day: number) => {
        const date = new Date(year, month, day);
        onSelect(date);
        onClose();
    };

    return (
        <div className="absolute top-12 right-4 z-50 bg-white border rounded-xl shadow-xl p-4 w-[260px]">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded">
                    <ChevronLeft size={18} />
                </button>
                <span className="text-sm font-medium">
                    {year}년 {month + 1}월
                </span>
                <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded">
                    <ChevronRight size={18} />
                </button>
            </div>

            {/* 요일 */}
            <div className="grid grid-cols-7 text-center text-[11px] text-gray-500 mb-1">
                {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
                    <div key={d}>{d}</div>
                ))}
            </div>

            {/* 날짜 */}
            <div className="grid grid-cols-7 gap-y-1 text-center">
                {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-8" />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const date = new Date(year, month, day);

                    const isToday = isSameDate(date, today);
                    const isSelected = isSameDate(date, selectedDate);

                    return (
                        <div key={day} className="flex flex-col items-center">
                            <button
                                className={`w-8 h-8 rounded-md text-xs flex items-center justify-center transition
                                    ${
                                    isSelected
                                        ? "bg-accent text-white"
                                        : isToday
                                            ? "bg-green-200 text-green-900 font-semibold"
                                            : "hover:bg-gray-100"
                                }`}
                                onClick={() => handleSelect(day)}
                            >
                                {day}
                            </button>
                            {isToday && (
                                <span className="text-[9px] text-red-500 leading-none">
                                    today
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
