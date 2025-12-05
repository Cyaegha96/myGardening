// 이미지 업로드 + 미리보기 + 제목/메모 미리보기
import type {PlantImageUploaderProps} from "@/features/myPlants/create-my-plant/model/PlantImageUploaderProps.ts";

export default function PlantImageUploader({
                                               imagePreview,
                                               isDragging,
                                               isPortrait,
                                               commonName,
                                               nickname,
                                               nicknameAlign,
                                               memoLines,
                                               selectedTarget,
                                               onImageChange,
                                               onDragOver,
                                               onDragLeave,
                                               onDrop,
                                               onClearImage,
                                               onSelectNickname,
                                               onSelectMemoLine,
                                               fileInputRef,
                                           }: PlantImageUploaderProps) {

    return (
        <div className="mb-4 relative flex flex-col items-center">
            {/* X 버튼 */}
            <button
                onClick={onClearImage}
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
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                    >
                        클릭 또는 드래그&드롭으로 이미지 업로드
                    </label>
                ) : (
                    <img
                        src={imagePreview}
                        className={`
                            object-contain cursor-pointer
                            ${isPortrait
                            ? "h-full w-auto mx-auto"
                            : "w-full h-auto max-h-[300px]"
                        }
                        `}
                        onClick={() => fileInputRef.current?.click()}
                    />
                )}

                {/* Common Name 표시 */}
                {commonName && (
                    <p className="mt-2 text-center text-sm text-green-700 font-semibold">
                        {commonName}
                    </p>
                )}

                {/* 닉네임 미리보기 */}
                {nickname && (
                    <div
                        className={`
                            mt-2 font-semibold text-sm text-gray-700 whitespace-pre-wrap cursor-pointer
                            ${selectedTarget?.type === "nickname" ? "bg-gray-200 rounded" : ""}
                        `}
                        style={{ textAlign: nicknameAlign }}
                        onClick={onSelectNickname}
                    >
                        {nickname}
                    </div>
                )}

                {/* 메모 라인 미리보기 */}
                {memoLines.length > 0 && (
                    <div className="mt-2 text-xs text-gray-700">
                        {memoLines.map((line, idx) => (
                            <div
                                key={idx}
                                onClick={() => onSelectMemoLine(idx)}
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

            {/* hidden input */}
            <input
                id="plant-image"
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={onImageChange}
            />
        </div>
    );
}
