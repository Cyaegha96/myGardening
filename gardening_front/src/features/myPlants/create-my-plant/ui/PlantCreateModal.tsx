import { useCallback, useRef, useState } from "react";
import type { PlantCreateModalProps } from "@/features/myPlants/create-my-plant/model/PlantCreateModalProps.ts";

// 파일 업로드 / 별명 / 메모 / 풋터 UI 컴포넌트
import PlantImageUploader from "@/features/myPlants/create-my-plant/ui/PlantImageUploader.tsx";
import PlantNicknameEditor from "@/features/myPlants/create-my-plant/ui/PlantNicknameEditor.tsx";
import PlantMemoEditor from "@/features/myPlants/create-my-plant/ui/PlantMemoEditor.tsx";
import PlantCreateModalFooter from "@/features/myPlants/create-my-plant/ui/PlantCreateModalFooter.tsx";

import type { Align, MemoLine } from "@/entities/myPlants/model/MemoLine.ts";
import type { SelectedTarget } from "@/entities/myPlants/model/SelectedTarget.ts";

import { Label } from "@/shared/shadcn/components/ui/label.tsx";
import CustomDatePicker from "@/entities/myPlants/ui/CustomDatePicker.tsx";

// API
import { PlantInfoControllerApi } from "@/shared/api";
import AlignmentToolbar from "@/features/myPlants/create-my-plant/ui/AlignmentToolbar.tsx";
import type {PlantDetailResponse} from "@/entities/searchPlant/searchPlantStore.ts";

export function PlantCreateModal({onClose, onSend}: PlantCreateModalProps) {

    // 오늘 날짜
    const today = new Date();

    // 상태
    const [imagePreview, setImagePreview] = useState<string>("noImage");
    const [isDragging, setIsDragging] = useState(false);

    // Common Name (식별 결과 표시용 - 수정 불가)
    const [commonName, setCommonName] = useState("");

    // 사용자가 입력하는 별명(선택사항)
    const [nickname, setNickname] = useState("");

    const [nicknameAlign, setNicknameAlign] = useState<Align>("center");

    const [memoText, setMemoText] = useState("");
    const [memoLines, setMemoLines] = useState<MemoLine[]>([]);
    const [selectedTarget, setSelectedTarget] = useState<SelectedTarget | null>(null);

    const [startDate, setStartDate] = useState<Date>(today);

    const [isPortrait, setIsPortrait] = useState(true);

    const [scientificName, setScientificName] = useState("");

    // file input DOM 제어 위해 Ref 사용
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // 이미지 처리 + PlantNet 인식 호출
    const handleFile = useCallback((file: File) => {
        const preview = URL.createObjectURL(file);

        const img = new Image();
        img.src = preview;
        img.onload = () => {
            setIsPortrait(img.height >= img.width);
            setImagePreview(preview); // 미리보기 UI 갱신
        };

        // 식물 인식 API 호출
        const plantApi = new PlantInfoControllerApi();

        plantApi
            .identifyPlantByPlantNetByFile(file)
            .then((res: PlantDetailResponse)  => {
                const data = res.data.data;
                if (!data || !data.scientificName) {
                    setCommonName("식별 실패");
                    return;
                }

                setScientificName(data.scientificName);
                setCommonName(data.commonName || "확실하지 않아요"); // 사용자에게 안내

            })
            .catch(() => setCommonName("식별 실패"));
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        handleFile(file);
    };

    // 드래그 업로드 이벤트
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

    // 이미지 x 버튼 클릭시
    const clearImage = () => {
        setImagePreview("noImage");
        if (fileInputRef.current) fileInputRef.current.value = "";
        setScientificName("");
        setCommonName("");
    };

    // 전체 초기화
    const handleResetAll = () => {
        setImagePreview("noImage");
        if (fileInputRef.current) fileInputRef.current.value = "";

        setCommonName("");
        setNickname("");
        setScientificName("");

        setNicknameAlign("center");
        setMemoText("");
        setMemoLines([]);

        setSelectedTarget(null);
        setStartDate(today);
    };

    // 메모 입력
    const updateMemoText = (value: string) => {
        setMemoText(value);
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

        if (selectedTarget.type === "nickname") {
            setNicknameAlign(align);
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

    // 정렬 대상 선택 표시
    const currentAlign = selectedTarget?.type === "nickname"
        ? nicknameAlign
        : selectedTarget?.type === "line"
            ? memoLines[selectedTarget.index!]?.align ?? "left"
            : "left";

    // 등록하기 API → 부모에게 데이터 전달
    const handleSubmit = () => {
        if (!scientificName) return alert("먼저 식물을 인식해주세요!");

        // 업로드할 파일 가져오기
        const file = fileInputRef.current?.files?.[0] ?? null;

        // onSend 세팅
        onSend?.({
            plantInfo: {
                nickname: nickname.trim() === "" ? undefined : nickname,
                plantScientificName: scientificName,
                memo: memoText,
                acquiredAt: startDate.toISOString().slice(0, 10)
            },
            file
        });
    };

    return (
        <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        >
            <div className="w-[460px] bg-white rounded-lg p-6 shadow-lg">

                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">새 식물 등록</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        ✕
                    </button>
                </div>

                {/* 이미지 업로드 */}
                <PlantImageUploader
                    imagePreview={imagePreview}
                    isDragging={isDragging}
                    isPortrait={isPortrait}
                    commonName={commonName}
                    nickname={nickname}
                    nicknameAlign={nicknameAlign}
                    memoLines={memoLines}
                    selectedTarget={selectedTarget}
                    onImageChange={handleImageChange}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClearImage={clearImage}
                    onSelectNickname={() => setSelectedTarget({type: "nickname"})}
                    onSelectMemoLine={(i) => setSelectedTarget({type: "line", index: i})}
                    fileInputRef={fileInputRef}
                />

                {/* CommonName 표시 */}
                {commonName && (
                    <p className="text-center text-sm text-green-700 font-medium mb-3">
                        {commonName}
                    </p>
                )}

                {/* 정렬 버튼 */}
                <AlignmentToolbar
                    currentAlign={currentAlign}
                    selectedTarget={selectedTarget}
                    onApplyAlign={applyAlign}
                />

                {/* 별명 */}
                <PlantNicknameEditor
                    nickname={nickname}
                    nicknameAlign={nicknameAlign}
                    selectedTarget={selectedTarget}
                    onChangeNickname={setNickname}
                    onSelectNickname={() => setSelectedTarget({type: "nickname"})}
                />

                {/* 날짜 */}
                <div className="mb-4">
                    <Label className="block mb-1 text-sm font-medium">키우기 시작한 날짜</Label>
                    <CustomDatePicker
                        value={startDate}
                        onChange={(date) => setStartDate(date ?? today)}
                    />
                </div>

                {/* 메모 */}
                <PlantMemoEditor memoText={memoText} onChangeMemoText={updateMemoText}/>

                <PlantCreateModalFooter
                    onResetAll={handleResetAll}
                    onSubmit={handleSubmit} // 부모 호출 트리거
                />
            </div>
        </div>
    );
}
