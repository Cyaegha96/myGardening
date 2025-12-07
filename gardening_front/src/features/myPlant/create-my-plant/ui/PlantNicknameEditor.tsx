import type { PlantTitleEditorProps } from "@/features/myPlant/create-my-plant/model/PlantTitleEditorProps.ts";

// 제목 입력 영역 UI (정렬 제거 버전)
export default function PlantNicknameEditor({
                                                nickname,
                                                onChangeNickname,
                                            }: PlantTitleEditorProps) {

    return (
        <div className="mb-4">
            <input
                type="text"
                maxLength={20}
                value={nickname}
                onChange={(e) => onChangeNickname(e.target.value)}
                className="
                    w-full border rounded px-3 py-2 bg-gray-50
                    focus:outline-none focus:ring-2 focus:ring-green-400
                    text-center
                "
                placeholder="식물 이름"
            />
        </div>
    );
}