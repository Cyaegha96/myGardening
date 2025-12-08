// DiaryWriteModal.tsx
// 다이어리 작성 모달

import { useState, useRef } from "react";
import type { DiaryWriteModalProps } from "../model/DiaryWriteModalProps";
import { Button } from "@/shared/shadcn/components/ui/button";
import { X } from "lucide-react";
import PolaroidCard from "@/entities/myPlant/ui/PolaroidCard"; // 변경: 미리보기를 PolaroidCard로 직접 사용
import PlantImageUploader from "@/features/myPlant/create-my-plant/ui/PlantImageUploader";
import DiaryWritePreview from "@/features/myPlant/diary/create-diary/ui/DiaryWritePreview.tsx";

export default function DiaryWriteModal({
                                            diary,
                                            onClose,
                                            onSubmit,
                                        }: DiaryWriteModalProps) {

    const [imagePreview, setImagePreview] = useState(diary?.imageUrl ?? "noImage");
    const [file, setFile] = useState<File | null>(null);
    const [content, setContent] = useState(diary?.content ?? "");
    const [weather, setWeather] = useState(diary?.weather ?? "");

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // 텍스트 입력 핸들러: 줄수 & byte 제한 적용
    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        let text = e.target.value;
        const encoder = new TextEncoder();

        // 이미지 여부에 따른 최대 줄 수 설정
        const maxLines = imagePreview === "noImage" ? 5 : 3;

        // 줄수 제한
        const lines = text.split("\n");
        if (lines.length > maxLines) {
            text = lines.slice(0, maxLines).join("\n");
        }

        // byte 제한 (500byte)
        while (encoder.encode(text).length > 500) {
            text = text.slice(0, -1);
        }

        setContent(text);
    };

    // 저장 버튼
    const handleSave = () => {
        if (!content.trim()) return;

        const normalizedWeather = weather.trim() === "" ? null : weather;

        // 수정 모드에서 기존 이미지 → 삭제되는 상황
        const isDeleteImage =
            diary?.imageUrl &&
            !file &&
            imagePreview === "noImage";

        onSubmit({
            content,
            weather: normalizedWeather, // 빈값을 null로 전달
            file,
            isDeleteImage,
        });
    };

    const encoder = new TextEncoder();
    const byteSize = encoder.encode(content).length;
    const currentLines = content.split("\n").length;
    const maxLines = imagePreview === "noImage" ? 5 : 3;

    return (
        // 전체 배경
        <div className="fixed inset-0 bg-black/40 z-[999] flex items-center justify-center p-4">

            {/* 모달 박스 */}
            <div className="
                w-full max-w-[900px] bg-white rounded-xl shadow-lg
                flex flex-col md:flex-row gap-6 p-6 relative
                overflow-y-auto max-h-[calc(100vh-60px)]
            ">

                {/* 헤더 */}
                <div className="absolute top-5 left-8 right-6 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">
                        {diary ? "다이어리 수정" : "다이어리 작성"}
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                        aria-label="close"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* 변경: 이미지 여부에 따라 UI 분기 */}
                <div className="w-full md:w-1/2 pt-10 flex justify-center min-h-[550px]">

                    {imagePreview === "noImage" ? (
                        // 이미지 없을 때: 기존 미리보기 유지
                        <DiaryWritePreview
                            content={content}
                            weather={weather}
                            imagePreview={imagePreview}
                        />
                    ) : (
                        // 이미지 있을 때: PolaroidCard + 종이 배경 + 날짜 표시
                        <div className="w-full h-full max-h-[550px] relative bg-[url('/assets/diary-paper-a.png')] bg-cover bg-center p-8 rounded-md border border-gray-300 shadow-sm">
                            <p className="text-xs text-gray-500 absolute top-3 left-3">
                                {new Date().toLocaleDateString("ko-KR")}
                            </p>

                            <div className="flex justify-center mt-6">
                                <PolaroidCard
                                    type="diary"
                                    variant="tape"
                                    width="280px"
                                    imageUrl={imagePreview}
                                    lines={content.split("\n")}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* 입력폼 */}
                <div className="w-full md:w-1/2 flex flex-col pt-10 min-h-[550px] max-h-[550px] overflow-hidden p-3 justify-center">

                    <PlantImageUploader
                        mode="diary"
                        imagePreview={imagePreview}
                        fileInputRef={fileInputRef}
                        onImageChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            setFile(file);

                            const reader = new FileReader();
                            reader.onload = () => setImagePreview(reader.result as string);
                            reader.readAsDataURL(file);

                            if (fileInputRef.current) {
                                fileInputRef.current.value = "";
                            }
                        }}
                        onClearImage={() => {
                            setFile(null);
                            setImagePreview("noImage");
                            if (fileInputRef.current) {
                                fileInputRef.current.value = "";
                            }
                        }}
                        isDragging={false}
                        isPortrait={false}
                        commonName=""
                        nickname=""
                        memoLines={[]}
                        onDragOver={() => {}}
                        onDragLeave={() => {}}
                        onDrop={() => {}}
                        className="max-h-full flex justify-center items-center"
                    />

                        {/* 날씨 */}
                    <select
                        value={weather}
                        onChange={(e) => setWeather(e.target.value)}
                        className="mt-4 border rounded-md px-3 py-2 text-sm w-full"
                    >
                        <option value="">날씨 선택 안함</option>
                        <option value="SUNNY">맑음</option>
                        <option value="CLOUDY">흐림</option>
                        <option value="RAINY">비</option>
                        <option value="SNOWY">눈</option>
                    </select>

                        {/* 텍스트 입력 */}
                        {/* 변경: placeholder 이모지 제거 */}
                    <textarea
                        value={content}
                        onChange={handleContentChange}
                        className="w-full h-[180px] mt-4 mb-2 border rounded-md p-3 text-sm"
                        placeholder="일지를 기록하세요"
                    />

                        {/* 줄수/바이트 안내 */}
                    <div className="text-right text-xs text-gray-400 mb-4">
                        {imagePreview === "noImage"
                            ? `줄바꿈 ${currentLines}/${maxLines}줄 · ${byteSize}/500 byte`
                            : `이미지 포함: ${currentLines}/${maxLines}줄 · ${byteSize}/500 byte`}
                    </div>

                        {/* 버튼 */}
                    <div className="flex justify-end">
                        <Button className="px-6 py-2" onClick={handleSave}>
                            {diary ? "수정" : "등록"}
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
}
