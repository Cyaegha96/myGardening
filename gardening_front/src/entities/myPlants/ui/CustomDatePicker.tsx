"use client";

import { useState } from "react";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

interface CustomDatePickerProps {
    value: Date | null;
    onChange: (date: Date | null) => void;
}

export default function CustomDatePicker({ value, onChange }: CustomDatePickerProps) {
    const [open, setOpen] = useState(false);

    const today = new Date();
    const year = value?.getFullYear() ?? today.getFullYear();
    const month = value?.getMonth() ?? today.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const isFuture = (day: number) => {
        const target = new Date(year, month, day);
        return target > today;
    };

    const handleSelect = (day: number) => {
        if (isFuture(day)) return;

        const selected = new Date(year, month, day);
        onChange(selected);
        setOpen(false);
    };

    const prevMonth = () => {
        const prev = new Date(year, month - 1, 1);
        onChange(new Date(prev.getFullYear(), prev.getMonth(), value?.getDate() ?? today.getDate()));
    };

    const nextMonth = () => {
        const next = new Date(year, month + 1, 1);
        onChange(new Date(next.getFullYear(), next.getMonth(), value?.getDate() ?? today.getDate()));
    };

    return (
        <div className="relative w-full">
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="w-full border rounded-md px-3 py-2 bg-white text-left flex items-center justify-between shadow-sm"
            >
                <span className="text-gray-700">
                    {value ? value.toLocaleDateString() : "날짜 선택"}
                </span>
                <CalendarIcon size={18} className="text-gray-500" />
            </button>

            {open && (
                <div
                    className="
            absolute z-50 mt-2 bg-white border rounded-lg shadow-lg p-3
            w-[230px]
          "
                >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-2">
                        <button
                            onClick={prevMonth}
                            className="p-1 rounded-md hover:bg-gray-100 transition"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <span className="font-medium text-xs">
              {year}년 {month + 1}월
            </span>
                        <button
                            onClick={nextMonth}
                            className="p-1 rounded-md hover:bg-gray-100 transition"
                        >
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

                            const isToday =
                                day === today.getDate() &&
                                month === today.getMonth() &&
                                year === today.getFullYear();

                            const isSelected =
                                value &&
                                value.getFullYear() === year &&
                                value.getMonth() === month &&
                                value.getDate() === day;

                            const disabled = isFuture(day);

                            return (
                                <div key={day} className="flex flex-col items-center leading-none">
                                    <button
                                        onClick={() => handleSelect(day)}
                                        disabled={disabled}
                                        className={`
                          w-8 h-8 flex items-center justify-center rounded-md text-xs
                          transition-all
                          ${disabled ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-100"}
                          ${
                                            isSelected
                                                ? "bg-accent text-white"
                                                : isToday
                                                    ? "bg-green-200 text-green-900"
                                                    : ""
                                        }
                        `}
                                    >
                                        {day}
                                    </button>

                                    {isToday && (
                                        <span className="text-[9px] text-red-500 mt-0.5">
                        today
                      </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}