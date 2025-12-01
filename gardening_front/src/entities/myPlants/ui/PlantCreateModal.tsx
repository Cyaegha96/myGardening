import { useState, useCallback } from "react";
import type { PlantCreateModalProps } from "@/entities/myPlants/model/PlantCreateModalProps";

// 정렬 아이콘
import {AlignLeft, AlignCenter, AlignRight, HelpCircle, CalendarIcon} from "lucide-react";
import type {Align, MemoLine} from "@/entities/myPlants/model/MemoLine.ts";
import type { SelectedTarget } from "../model/SelectedTarget";
import {Label} from "@/shared/shadcn/components/ui/label.tsx";
import {DatePicker, DatePickerContent} from "@/shared/shadcn/components/ui/date-picker.tsx";
import {FieldGroup} from "@/shared/shadcn/components/ui/field.tsx";
import { DateInput } from "@/shared/shadcn/components/ui/datefield";
import {Button} from "@/shared/shadcn/components/ui/button.tsx";
import {
    CalendarCell,
    CalendarGrid,
    CalendarGridBody,
    CalendarGridHeader,
    CalendarHeaderCell
} from "react-aria-components";
import {CalendarHeader} from "@/features/schedule/ui/calendar/header/calendar-header.tsx";
import {Calendar} from "@/shared/shadcn/components/ui/calendar.tsx";


export default function PlantCreateModal({ onClose, onSubmit }: PlantCreateModalProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    /** 제목 */
    const [name, setName] = useState("");
    const [titleAlign, setTitleAlign] = useState<Align>("center");

    /** 메모 */
    const [memoLines, setMemoLines] = useState<MemoLine[]>([]);
    const [selectedTarget, setSelectedTarget] = useState<SelectedTarget | null>(null);

    /** 도움말 토글 */
    const [showHelp, setShowHelp] = useState(false);

    /** 시작 날짜 */
    const [startDate, setStartDate] = useState<Date | null>(null);

    /** 파일 처리 */
    const handleFile = useCallback((file: File) => {
        const preview = URL.createObjectURL(file);
        setImagePreview(preview);
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        handleFile(file);
    };

    /** 드래그 앤 드롭 */
    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = () => setIsDragging(false);
    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };

    const clearImage = () => setImagePreview(null);

    /** textarea 입력 → 줄 단위로 관리 */
    const updateMemoText = (value: string) => {
        const lines = value.split("\n");
        const nextLines: MemoLine[] = lines.map((t, i) => ({
            text: t,
            align: memoLines[i]?.align ?? "left",
        }));
        setMemoLines(nextLines);
    };

    /** 정렬 버튼 클릭 */
    const applyAlign = (align: Align) => {
        if (!selectedTarget) return;

        // 제목 정렬
        if (selectedTarget.type === "title") {
            setTitleAlign(align);
            return;
        }

        // 메모 한 줄 정렬
        if (selectedTarget.type === "line") {
            const index = selectedTarget.index!;
            setMemoLines(prev =>
                prev.map((line, i) =>
                    i === index ? { ...line, align } : line
                )
            );
        }
    };

    const getCurrentAlign = (): Align => {
        if (!selectedTarget) return "left";

        if (selectedTarget.type === "title") return titleAlign;
        if (selectedTarget.type === "line") {
            return memoLines[selectedTarget.index!]?.align ?? "left";
        }
        return "left";
    };

    const currentAlign = getCurrentAlign();

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="w-[460px] bg-white rounded-lg p-6 shadow-lg">

                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">새 식물 등록</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>

                {/* ----------------------------------------------------------- */}
                {/* 📌 사진 업로드 + 미리보기 */}
                {/* ----------------------------------------------------------- */}
                <div className="mb-6">
                    {!imagePreview && (
                        <label
                            htmlFor="plant-image"
                            className={`
                w-full h-48 border-2 border-dashed rounded-md 
                flex items-center justify-center cursor-pointer
                text-gray-500 bg-gray-50 transition-all
                ${isDragging ? "border-green-500 bg-green-50" : "border-gray-300"}
              `}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            클릭 또는 드래그&드롭으로 이미지 업로드
                        </label>
                    )}

                    {imagePreview && (
                        <div className="relative flex justify-center">

                            {/* X */}
                            <button
                                onClick={clearImage}
                                className="absolute right-2 top-2 bg-black/40 text-white px-2 py-1 rounded text-xs"
                            >
                                ✕
                            </button>

                            {/* 폴라로이드 */}
                            <div className="bg-white p-3 pb-6 rounded-md shadow-md w-full max-w-xs">
                                <img
                                    src={imagePreview}
                                    className="w-full rounded object-contain cursor-pointer"
                                    style={{ maxHeight: "300px" }}
                                    onClick={() => document.getElementById("plant-image")?.click()}
                                />

                                {/* 제목 미리보기 */}
                                {name && (
                                    <div
                                        onClick={() => setSelectedTarget({ type: "title" })}
                                        className={`
                      mt-3 font-semibold text-sm text-gray-700 whitespace-pre-wrap cursor-pointer
                      ${selectedTarget?.type === "title" ? "bg-gray-200 rounded" : ""}
                    `}
                                        style={{ textAlign: titleAlign }}
                                    >
                                        {name}
                                    </div>
                                )}

                                {/* 메모 미리보기 */}
                                {memoLines.length > 0 && (
                                    <div className="mt-2 text-xs text-gray-700">
                                        {memoLines.map((line, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => setSelectedTarget({ type: "line", index: idx })}
                                                className={`
                          whitespace-pre-wrap px-1 py-0.5 cursor-pointer
                          ${selectedTarget?.type === "line" && selectedTarget.index === idx
                                                    ? "bg-gray-200 rounded"
                                                    : ""}
                        `}
                                                style={{ textAlign: line.align }}
                                            >
                                                {line.text || " "}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <input
                        id="plant-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                    />
                </div>

                {/* ----------------------------------------------------------- */}
                {/* 🧷 정렬 버튼 (가운데) + 도움말 (?) 오른쪽 끝 */}
                {/* ----------------------------------------------------------- */}
                <div className="flex items-center mb-4 w-full relative">

                    {/* 가운데 정렬 버튼 */}
                    <div className="absolute left-1/2 -translate-x-1/2">
                        <div className="inline-flex border rounded-md overflow-hidden shadow-sm">
                            <button
                                onClick={() => applyAlign("left")}
                                className={`p-2 border-r ${currentAlign === "left" ? "bg-gray-200" : ""}`}
                            >
                                <AlignLeft size={18} />
                            </button>

                            <button
                                onClick={() => applyAlign("center")}
                                className={`p-2 border-r ${currentAlign === "center" ? "bg-gray-200" : ""}`}
                            >
                                <AlignCenter size={18} />
                            </button>

                            <button
                                onClick={() => applyAlign("right")}
                                className={`p-2 ${currentAlign === "right" ? "bg-gray-200" : ""}`}
                            >
                                <AlignRight size={18} />
                            </button>
                        </div>
                    </div>

                    {/* 도움말 버튼 */}
                    <div className="ml-auto">
                        <button
                            onClick={() => setShowHelp(prev => !prev)}
                            className="p-2 rounded-full hover:bg-gray-100 transition"
                            title="정렬 도움말"
                        >
                            <HelpCircle size={20} className="text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* 도움말 */}
                {showHelp && (
                    <div className="mb-4 bg-gray-50 border border-gray-200 rounded-md p-4 text-sm text-gray-700 shadow-sm">
                        <p className="font-semibold mb-2">줄 정렬하는 방법</p>

                        <p className="leading-6 mb-2">
                            1. <strong>사진 아래 미리보기</strong>에서 제목 또는 메모 줄을 탭하세요.<br />
                            → 선택된 줄은 <strong>회색 배경</strong>으로 표시됩니다.
                        </p>

                        <p className="leading-6 mb-2">
                            2. 화면 위의 정렬 버튼을 누르세요.<br />
                            → 선택한 줄에만 정렬이 적용됩니다.
                        </p>

                        <p className="text-xs text-gray-500 leading-5">
                            * 메모 입력창은 입력만 가능하며, 줄 단위 정렬은 미리보기에서만 가능합니다.
                        </p>
                    </div>
                )}

                {/* ----------------------------------------------------------- */}
                {/* ✏️ 제목 입력 */}
                {/* ----------------------------------------------------------- */}
                <div className="mb-4">
                    <input
                        type="text"
                        maxLength={20}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onClick={() => setSelectedTarget({ type: "title" })}
                        className={`
              w-full border rounded px-3 py-2 bg-gray-50 cursor-pointer
              ${selectedTarget?.type === "title" ? "bg-gray-100" : ""}
            `}
                        placeholder="식물 이름"
                        style={{ textAlign: titleAlign }}
                    />
                </div>

                {/* ----------------------------------------------------------- */}
                {/* 🌱 키운 날짜 선택 — shadcn date-picker */}
                {/* ----------------------------------------------------------- */}
                <div className="mb-4">
                    <Label className="block mb-1 text-sm font-medium">키우기 시작한 날짜</Label>

                    <DatePicker
                        value={startDate ?? undefined}
                        onChange={(date) => setStartDate(date ?? null)}
                        className="min-w-[208px] space-y-1"
                    >
                        <FieldGroup>
                            <DateInput
                                className="flex-1"
                                variant="ghost"
                                placeholder="날짜 선택"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="mr-1 size-6 data-[focus-visible]:ring-offset-0"
                            >
                                <CalendarIcon aria-hidden className="size-4" />
                            </Button>
                        </FieldGroup>

                        <DatePickerContent>
                            <Calendar
                                mode="single"
                                selected={startDate ?? undefined}
                                onSelect={(d) => setStartDate(d ?? null)}
                            >
                                <CalendarHeader />
                                <CalendarGrid>
                                    <CalendarGridHeader>
                                        {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
                                    </CalendarGridHeader>

                                    <CalendarGridBody>
                                        {(date) => <CalendarCell date={date} />}
                                    </CalendarGridBody>
                                </CalendarGrid>
                            </Calendar>
                        </DatePickerContent>
                    </DatePicker>
                </div>

                {/* ----------------------------------------------------------- */}
                {/* 📝 메모 입력 */}
                {/* ----------------------------------------------------------- */}
                <div className="mb-4">
          <textarea
              placeholder="메모를 입력하세요"
              className="w-full border rounded px-3 py-2 h-28 resize-none bg-gray-50"
              onChange={(e) => updateMemoText(e.target.value)}
          />
                </div>

                <Button className="w-full" onClick={onSubmit}>
                    등록하기
                </Button>

            </div>
        </div>
    );
}
