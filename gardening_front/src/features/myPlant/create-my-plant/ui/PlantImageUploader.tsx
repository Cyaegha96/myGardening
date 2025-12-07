// 이미지 업로드 + 미리보기 + 제목/메모 미리보기
import type { PlantImageUploaderProps } from "@/features/myPlant/create-my-plant/model/PlantImageUploaderProps.ts";

export default function PlantImageUploader({
                                               mode,
                                               imagePreview,
                                               isDragging,
                                               isPortrait,
                                               commonName,
                                               nickname,
                                               memoLines,
                                               onImageChange,
                                               onDragOver,
                                               onDragLeave,
                                               onDrop,
                                               onClearImage,
                                               fileInputRef
                                           }: PlantImageUploaderProps) {

    // plant 모드에서만 텍스트 미리보기 영역 출력
    const showTextPreview = mode === "plant";

    // diary 모드에서는 이미지가 있을 때만 X 버튼 노출
    const showClearBtn = mode === "diary" ? imagePreview !== "noImage" : true;

    // 모드별 input id 분기 (재업로드 문제 해결)
    const inputId = mode === "diary" ? "diary-image" : "plant-image";

    return (
        <div className="mb-4 relative flex flex-col items-center w-full">

            {/* 이미지 삭제(X) 버튼 */}
            {showClearBtn && (
                <button
                    onClick={onClearImage}
                    className={`
                        absolute z-50
                        top-2 right-2
                        w-6 h-6 rounded-full flex items-center justify-center
                        bg-black/50 text-white text-xs
                        hover:bg-black/70 transition
                    `}
                >
                    ✕
                </button>
            )}

            {/* 카드 박스 */}
            <div className={`
                bg-white rounded-md shadow-md p-3 pb-6 relative w-full
                ${mode === "plant" ? "max-w-[380px]" : ""}
            `}>

                {/* 이미지가 없을 때 */}
                {imagePreview === "noImage" ? (
                    <label
                        htmlFor={inputId}
                        className={`
                            w-full h-48 border-2 border-dashed rounded-md
                            flex items-center justify-center cursor-pointer
                            text-gray-500 bg-gray-50 transition-all
                            ${isDragging ? "border-green-500 bg-green-50" : "border-gray-300"}
                        `}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                    >
                        클릭 또는 드래그&드롭으로 이미지 업로드
                    </label>
                ) : (
                    <img
                        src={imagePreview}
                        className="
        cursor-pointer mx-auto
        object-contain
        h-48
        max-w-full
        rounded-md
    "
                        onClick={() => fileInputRef.current?.click()}
                    />

                )}

                {/* 식물 등록 모드 → 텍스트 미리보기 */}
                {showTextPreview && (
                    <>
                        {commonName && (
                            <p className="mt-2 text-center text-sm text-green-700 font-semibold">
                                {commonName}
                            </p>
                        )}
                        {nickname && (
                            <div className="mt-2 font-semibold text-sm text-gray-700 text-center whitespace-pre-wrap">
                                {nickname}
                            </div>
                        )}
                        {memoLines.length > 0 && (
                            <div className="mt-2 text-xs text-gray-700 text-center">
                                {memoLines.map((line, idx) => (
                                    <div key={idx} className="whitespace-pre-wrap">
                                        {line.text || " "}
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* hidden file input */}
            <input
                id={inputId}
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={onImageChange}
            />
        </div>
    );
}
