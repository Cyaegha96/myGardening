import type {PlantMemoEditorProps} from "@/features/myPlant/create-my-plant/model/PlantMemoEditorProps.ts";

// 메모 입력 텍스트 영역 UI
export default function PlantMemoEditor({
                                            memoText,
                                            onChangeMemoText,
                                        }: PlantMemoEditorProps) {
    // 메모
    return (
        <div className="mb-4">
            <textarea
                value={memoText}
                placeholder="메모를 입력하세요"
                className="w-full border rounded px-3 py-2 h-28 resize-none bg-gray-50"
                onChange={(e) => onChangeMemoText(e.target.value)}
            />
        </div>
    );
}