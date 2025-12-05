import type {PlantTitleEditorProps} from "@/features/myPlants/create-my-plant/model/PlantTitleEditorProps.ts";

// 제목 입력 영역 UI
export default function PlantNicknameEditor({
                                             nickname,
                                             nicknameAlign,
                                             selectedTarget,
                                             onChangeNickname,
                                             onSelectNickname,
                                         }: PlantTitleEditorProps) {
    // 제목
    return (
        <div className="mb-4">
            <input
                type="text"
                maxLength={20}
                value={nickname}
                onChange={(e) => onChangeNickname(e.target.value)}
                onClick={onSelectNickname}
                className={`
                    w-full border rounded px-3 py-2 bg-gray-50 cursor-pointer
                    ${selectedTarget?.type === "nickname" ? "bg-gray-100" : ""}
                `}
                placeholder="식물 이름"
                style={{textAlign: nicknameAlign}}
            />
        </div>
    );
}
