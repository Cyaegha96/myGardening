// DiaryWriteModal.tsx
// 다이어리 작성 모달

import {useRef, useState} from "react";
import type {DiaryWriteModalProps} from "../model/DiaryWriteModalProps";
import {Button} from "@/shared/shadcn/components/ui/button";
import {Cloud, CloudRain, Snowflake, Sun, X} from "lucide-react";
import PolaroidCard from "@/entities/myPlant/ui/PolaroidCard";
import PlantImageUploader from "@/features/myPlant/create-my-plant/ui/PlantImageUploader";
import DiaryWritePreview from "@/features/myPlant/diary/create-diary/ui/DiaryWritePreview.tsx";
import {toast} from "sonner";

export default function DiaryWriteModal({
                                            diary,
                                            onClose,
                                            onSubmit,
                                        }: DiaryWriteModalProps) {

    // 초기 상태 설정: diary가 없을 경우 신규 작성 모드
    const [imagePreview, setImagePreview] = useState(diary?.imageUrl ?? "noImage");
    const [file, setFile] = useState<File | null>(null);
    const [content, setContent] = useState(diary?.content ?? "");
    const [weather, setWeather] = useState(diary?.weather ?? ""); // enum 문자열 사용됨 (빈값 허용)
    const [initialHadImage] = useState(!!diary?.imageUrl); // 초기에 이미지가 있었는지 저장
    const [isRemoved, setIsRemoved] = useState(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // 드래그 상태 추가
    const [isDragging, setIsDragging] = useState(false);

    // 드래그 이벤트 핸들러
    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files?.[0];
        if (!droppedFile) return;
        if (!droppedFile.type.startsWith("image/")) {
            toast.error("이미지 파일만 업로드할 수 있습니다.");
            return;
        }

        setFile(droppedFile);
        setIsRemoved(false); // 이미지 업로드 시 삭제 의도 해제

        const reader = new FileReader();
        reader.onload = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(droppedFile);

        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // 이미지 제거
    const handleClearImage = () => {
        setFile(null);
        setImagePreview("noImage");
        setIsRemoved(true); // 삭제 의도 설정
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const weatherIcon = (() => {
        switch (weather) {
            case "SUNNY":
                return <Sun size={14} className="text-yellow-500"/>;
            case "CLOUDY":
                return <Cloud size={14} className="text-gray-500"/>;
            case "RAINY":
                return <CloudRain size={14} className="text-blue-500"/>;
            case "SNOWY":
                return <Snowflake size={14} className="text-blue-400"/>;
            default:
                return null;
        }
    })();

    // 텍스트 입력 핸들러
    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        let text = e.target.value;
        const encoder = new TextEncoder();

        const maxLines = imagePreview === "noImage" ? 5 : 3;

        const lines = text.split("\n");
        if (lines.length > maxLines) {
            text = lines.slice(0, maxLines).join("\n");
        }

        while (encoder.encode(text).length > 500) {
            text = text.slice(0, -1);
        }

        setContent(text);
    };

    // 저장 버튼
    const handleSave = () => {
        const trimmedContent = content.trim();

        if (!trimmedContent) {
            toast.error("내용을 입력해주세요.");
            return;
        }

        // 날씨는 빈 문자열 허용 → 그대로 전달
        const normalizedWeather = weather;

        // 이미지 삭제 여부 판정: 기존 이미지가 있었고, 현재 삭제 상태 + 파일 미선택
        const deleteImage =
            initialHadImage &&
            isRemoved &&
            !file &&
            imagePreview === "noImage";

        console.log("deleteImage: ", deleteImage);

        // 그대로 전달 (FormData는 상위에서 처리)
        onSubmit({
            content: trimmedContent,
            weather: normalizedWeather,
            deleteImage,
            file: file ?? null,
        });
    };

    const encoder = new TextEncoder();
    const byteSize = encoder.encode(content).length;
    const currentLines = content.split("\n").length;
    const maxLines = imagePreview === "noImage" ? 5 : 3;

    return (
        <div className="fixed inset-0 bg-black/40 z-[999] flex items-center justify-center p-4">
            <div
                className="
                    w-full max-w-[900px] bg-white rounded-xl shadow-lg
                    flex flex-col md:flex-row gap-6 p-6 relative
                    overflow-y-auto max-h-[calc(100vh-60px)]
                "
            >
                <div className="absolute top-5 left-8 right-6 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">
                        {diary ? "다이어리 수정" : "다이어리 작성"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                        aria-label="close"
                    >
                        <X size={20}/>
                    </button>
                </div>

                {/* 이미지 여부에 따라 UI 분기 */}
                <div className="
                    w-full md:w-1/2 pt-10 flex justify-center
                    min-h-auto md:min-h-[550px]
                    h-auto md:h-[550px]
                ">
                    {imagePreview === "noImage" ? (
                        <DiaryWritePreview
                            content={content}
                            weather={weather}
                            imagePreview={imagePreview}
                        />
                    ) : (
                        <div
                            className="
                                w-full h-full max-h-[550px] relative
                                bg-[url('/assets/diary-paper-a.png')]
                                bg-cover bg-center p-8 rounded-md
                                border border-gray-300 shadow-sm
                            "
                        >
                            <div className="absolute top-3 left-3 flex items-center gap-1">
                                <span className="text-xs text-gray-500">
                                    {new Date().toLocaleDateString("ko-KR")}
                                </span>
                                {weatherIcon}
                            </div>

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
                <div
                    className="
                        w-full md:w-1/2 flex flex-col
                        pt-10
                        min-h-auto md:min-h-[550px]
                        max-h-none md:max-h-[550px]
                        overflow-auto md:overflow-hidden
                        p-3 justify-start md:justify-center
                    "
                >
                    <PlantImageUploader
                        mode="diary"
                        imagePreview={imagePreview}
                        fileInputRef={fileInputRef}
                        onImageChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            setFile(file);
                            setIsRemoved(false); // 업로드 시 삭제 취소

                            const reader = new FileReader();
                            reader.onload = () => setImagePreview(reader.result as string);
                            reader.readAsDataURL(file);

                            if (fileInputRef.current) {
                                fileInputRef.current.value = "";
                            }
                        }}
                        onClearImage={handleClearImage}
                        isDragging={isDragging}
                        commonName=""
                        nickname=""
                        memoLines={[]}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    />

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

                    <textarea
                        value={content}
                        onChange={handleContentChange}
                        className="w-full min-h-[130px] h-[130px] mt-4 mb-2 border rounded-md p-3 text-sm"
                        placeholder="일지를 기록하세요"
                    />

                    <div className="text-right text-xs text-gray-400 mb-4">
                        {imagePreview === "noImage"
                            ? `줄바꿈 ${currentLines}/${maxLines}줄 · ${byteSize}/500 byte`
                            : `이미지 포함: ${currentLines}/${maxLines}줄 · ${byteSize}/500 byte`}
                    </div>

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
