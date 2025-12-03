import {useCallback, useState} from "react";
import type {PlantCreateModalProps} from "@/features/myPlants/create-my-plant/model/PlantCreateModalProps.ts";

import {AlignCenter, AlignLeft, AlignRight, HelpCircle} from "lucide-react";
import type {Align, MemoLine} from "@/entities/myPlants/model/MemoLine.ts";
import type {SelectedTarget} from "@/entities/myPlants/model/SelectedTarget.ts";
import {Label} from "@/shared/shadcn/components/ui/label.tsx";
import {Button} from "@/shared/shadcn/components/ui/button.tsx";
import CustomDatePicker from "@/entities/myPlants/ui/CustomDatePicker.tsx";

export default function PlantCreateModal({onClose, onSubmit}: PlantCreateModalProps) {

    /** 기본이미지 경로 */
        // const DEFAULT_IMAGE = "/assets/default-myplant.png";

        // 오늘 날짜
    const today = new Date();

    // 상태
    const [imagePreview, setImagePreview] = useState<string>("noImage");
    const [isDragging, setIsDragging] = useState(false);

    const [name, setName] = useState("");
    const [titleAlign, setTitleAlign] = useState<Align>("center");

    const [memoText, setMemoText] = useState("");
    const [memoLines, setMemoLines] = useState<MemoLine[]>([]);
    const [selectedTarget, setSelectedTarget] = useState<SelectedTarget | null>(null);

    const [showHelp, setShowHelp] = useState(false);

    // 날짜 초기값 = 오늘
    const [startDate, setStartDate] = useState<Date>(today);

    // 이미지 처리
    const handleFile = useCallback((file: File) => {
        const preview = URL.createObjectURL(file);
        setImagePreview(preview);
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        handleFile(file);
    };

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

    const clearImage = () => setImagePreview("noImage");

    // 전체 초기화
    const handleResetAll = () => {
        setImagePreview("noImage");
        setName("");
        setTitleAlign("center");

        setMemoText("");
        setMemoLines([]);

        setSelectedTarget(null);
        setStartDate(today);
    };

    // 메모 입력
    const updateMemoText = (value: string) => {
        const lines = value.split("\n");
        const nextLines: MemoLine[] = lines.map((t, i) => ({
            text: t,
            align: memoLines[i]?.align ?? "left",
        }));
        setMemoLines(nextLines);
    };

    // 정렬 적용
    const applyAlign = (align: Align) => {
        if (!selectedTarget) return;

        if (selectedTarget.type === "title") {
            setTitleAlign(align);
            return;
        }

        if (selectedTarget.type === "line") {
            const idx = selectedTarget.index!;
            setMemoLines(prev =>
                prev.map((line, i) =>
                    i === idx ? {...line, align} : line
                )
            );
        }
    };

    // 정렬하기 위해 선택한 줄
    const currentAlign = selectedTarget?.type === "title"
        ? titleAlign
        : selectedTarget?.type === "line"
            ? memoLines[selectedTarget.index!]?.align ?? "left"
            : "left";

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="w-[460px] bg-white rounded-lg p-6 shadow-lg">

                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">새 식물 등록</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>

                {/* 이미지 업로드 */}
                <div className="mb-4 relative flex flex-col items-center">
                    {/* X 버튼 */}
                    <button
                        onClick={clearImage}
                        className="absolute right-2 top-2 bg-black/40 text-white px-2 py-1 rounded text-xs"
                    >
                        ✕
                    </button>

                    {/* 카드 박스 */}
                    <div className="bg-white p-3 pb-6 rounded-md shadow-md w-80 relative">

                        {imagePreview === "noImage" ? (
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
                        ) : (
                            <img
                                src={imagePreview}
                                className="w-full rounded object-contain cursor-pointer"
                                style={{maxHeight: "300px"}}
                                onClick={() => document.getElementById("plant-image")?.click()}
                            />
                        )}


                        {/* 제목 */}
                        {name && (
                            <div
                                onClick={() => setSelectedTarget({type: "title"})}
                                className={`
                                            mt-3 font-semibold text-sm text-gray-700 whitespace-pre-wrap cursor-pointer
                                            ${selectedTarget?.type === "title" ? "bg-gray-200 rounded" : ""}
                                        `}
                                style={{textAlign: titleAlign}}
                            >
                                {name}
                            </div>
                        )}

                        {/* 메모 */}
                        {memoLines.length > 0 && (
                            <div className="mt-2 text-xs text-gray-700">
                                {memoLines.map((line, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedTarget({type: "line", index: idx})}
                                        className={`
                                                        whitespace-pre-wrap px-1 py-0.5 cursor-pointer
                                                        ${selectedTarget?.type === "line" && selectedTarget.index === idx
                                            ? "bg-gray-200 rounded"
                                            : ""}
                                                    `}
                                        style={{textAlign: line.align}}
                                    >
                                        {line.text || " "}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <input
                        id="plant-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                    />
                </div>


                {/* 정렬 + 도움말 */}
                <div className="flex items-center mb-4 w-full relative">

                    <div className="absolute left-1/2 -translate-x-1/2">
                        <div className="inline-flex border rounded-md overflow-hidden shadow-sm">
                            <button
                                onClick={() => applyAlign("left")}
                                className={`p-2 border-r ${currentAlign === "left" ? "bg-gray-200" : ""}`}
                            >
                                <AlignLeft size={18}/>
                            </button>

                            <button
                                onClick={() => applyAlign("center")}
                                className={`p-2 border-r ${currentAlign === "center" ? "bg-gray-200" : ""}`}
                            >
                                <AlignCenter size={18}/>
                            </button>

                            <button
                                onClick={() => applyAlign("right")}
                                className={`p-2 ${currentAlign === "right" ? "bg-gray-200" : ""}`}
                            >
                                <AlignRight size={18}/>
                            </button>
                        </div>
                    </div>

                    <div className="ml-auto">
                        <button
                            onClick={() => setShowHelp(prev => !prev)}
                            className="p-2 rounded-full hover:bg-gray-100 transition"
                        >
                            <HelpCircle size={20} className="text-gray-600"/>
                        </button>
                    </div>
                </div>

                {showHelp && (
                    <div
                        className="mb-4 bg-gray-50 border border-gray-200 rounded-md p-4 text-sm text-gray-700 shadow-sm">
                        <p className="font-semibold mb-2">줄 정렬하는 방법</p>
                        <p className="leading-6 mb-2">
                            1. 사진 아래 미리보기에서 제목 또는 줄을 클릭하세요.<br/>
                            선택된 줄은 회색 배경으로 표시됩니다.
                        </p>
                        <p className="leading-6 mb-2">
                            2. 위의 정렬 버튼을 누르면 해당 줄에만 적용됩니다.
                        </p>
                        <p className="text-xs text-gray-500">
                            * 메모 입력창은 입력만 가능하며, 정렬은 미리보기에서만 가능합니다.
                        </p>
                    </div>
                )}

                {/* 제목 */}
                <div className="mb-4">
                    <input
                        type="text"
                        maxLength={20}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onClick={() => setSelectedTarget({type: "title"})}
                        className={`
                            w-full border rounded px-3 py-2 bg-gray-50 cursor-pointer
                            ${selectedTarget?.type === "title" ? "bg-gray-100" : ""}
                        `}
                        placeholder="식물 이름"
                        style={{textAlign: titleAlign}}
                    />
                </div>

                {/* 날짜 */}
                <div className="mb-4">
                    <Label className="block mb-1 text-sm font-medium">키우기 시작한 날짜</Label>

                    <CustomDatePicker
                        value={startDate}
                        onChange={(date) => setStartDate(date ?? today)}
                    />
                </div>

                {/* 메모 */}
                <div className="mb-4">
                    <textarea
                        value={memoText}
                        placeholder="메모를 입력하세요"
                        className="w-full border rounded px-3 py-2 h-28 resize-none bg-gray-50"
                        onChange={(e) => {
                            setMemoText(e.target.value);
                            updateMemoText(e.target.value);
                        }}
                    />
                </div>

                {/* 버튼 두 개 (오른쪽 정렬) */}
                <div className="flex justify-end gap-2 mt-6">
                    <Button
                        variant="destructive"
                        className="px-4 py-2 text-sm"
                        onClick={handleResetAll}
                    >
                        전체 초기화
                    </Button>
                    <Button
                        variant="default"
                        className="px-4 py-2 text-sm"
                        onClick={onSubmit}
                    >
                        등록하기
                    </Button>
                </div>

            </div>
        </div>
    );
}
