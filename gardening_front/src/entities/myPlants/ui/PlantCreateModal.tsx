import { useState } from "react";
import type {PlantCreateModalProps} from "@/entities/myPlants/model/PlantCreateModalProps.ts";
import {Button} from "@/shared/shadcn/components/ui/button.tsx";

export default function PlantCreateModal({ onClose, onSubmit }: PlantCreateModalProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const preview = URL.createObjectURL(file);
        setImagePreview(preview);
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="w-[420px] bg-white rounded-lg p-6 shadow-lg">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">새 식물 등록</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        ✕
                    </button>
                </div>

                {/* 식물 이름 */}
                <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium">식물 이름</label>
                    <input
                        type="text"
                        placeholder="예: 내 몬스테라"
                        className="w-full border rounded-md px-3 py-2 bg-gray-50 focus:outline-none focus:ring"
                    />
                </div>

                {/* 사진 업로드 (1장) */}
                <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium">사진 업로드</label>

                    {/* 업로드 박스 */}
                    <label
                        htmlFor="plant-image"
                        className="w-full h-32 border-2 border-dashed rounded-md flex items-center justify-center cursor-pointer bg-gray-50 text-gray-500"
                    >
                        {imagePreview ? (
                            <img
                                src={imagePreview}
                                alt="preview"
                                className="h-full object-cover rounded-md"
                            />
                        ) : (
                            "이미지 선택하기"
                        )}
                    </label>

                    <input
                        id="plant-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                    />
                </div>

                {/* 메모 */}
                <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium">메모</label>
                    <textarea
                        placeholder="식물에 대한 메모를 입력하세요"
                        className="w-full border rounded-md px-3 py-2 h-20 resize-none bg-gray-50 focus:outline-none focus:ring"
                    />
                </div>

                {/* 버튼 */}
                <Button
                    onClick={onSubmit}
                    className="w-full py-2 rounded-md bg-green-600 text-white font-medium hover:bg-green-700"
                >
                    등록하기
                </Button>
            </div>
        </div>
    );
}
