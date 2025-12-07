import { useCallback, useRef, useState } from "react";
import type { PlantCreateModalProps } from "@/features/myPlant/create-my-plant/model/PlantCreateModalProps.ts";

// 파일 업로드 + UI 컴포넌트
import PlantImageUploader from "@/features/myPlant/create-my-plant/ui/PlantImageUploader.tsx";
import PlantNicknameEditor from "@/features/myPlant/create-my-plant/ui/PlantNicknameEditor.tsx";
import PlantMemoEditor from "@/features/myPlant/create-my-plant/ui/PlantMemoEditor.tsx";
import PlantCreateModalFooter from "@/features/myPlant/create-my-plant/ui/PlantCreateModalFooter.tsx";

import type { MemoLine } from "@/entities/myPlant/model/MemoLine.ts";
import { Label } from "@/shared/shadcn/components/ui/label.tsx";
import CustomDatePicker from "@/entities/myPlant/ui/CustomDatePicker.tsx";

// 식물 인식 API
import { PlantInfoControllerApi } from "@/shared/api";
import type { PlantDetail } from "@/entities/searchPlant/searchPlantStore.ts";
import { toast } from "sonner";

export function PlantCreateModal({ onClose, onSend }: PlantCreateModalProps) {

    /** 오늘 날짜 */
    const today = new Date();

    /** UI 상태 */
    const [imagePreview, setImagePreview] = useState<string>("noImage");
    const [isDragging, setIsDragging] = useState(false);

    /** 인식된 학명 → 저장 필수 */
    const [scientificName, setScientificName] = useState("");

    /** 인식된 일반명 (수정 불가) */
    const [commonName, setCommonName] = useState("");

    /** 사용자가 입력하는 별명(선택) */
    const [nickname, setNickname] = useState("");

    /** 메모 - 최대 3줄 */
    const [memoText, setMemoText] = useState("");
    const [memoLines, setMemoLines] = useState<MemoLine[]>([]);

    /** 키운 날짜 */
    const [startDate, setStartDate] = useState<Date>(today);

    /** 사진 가로세로 비율 */
    const [isPortrait, setIsPortrait] = useState(true);

    /** 업로드 파일 DOM 접근용 */
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    /**
     * ⭐ 이미지 파일 처리 + PlantNet API 호출
     */
    const handleFile = useCallback((file: File) => {
        // 브라우저 미리보기 URL 생성
        const preview = URL.createObjectURL(file);

        // 세로/가로 비율 판단 → 미리보기 UI 스타일 반영
        const img = new Image();
        img.src = preview;
        img.onload = () => {
            setIsPortrait(img.height >= img.width);
            setImagePreview(preview);
        };

        // 식물 인식 API 호출
        const plantApi = new PlantInfoControllerApi();
        plantApi.identifyPlantByPlantNetByFile(file)
            .then((resp) => {
                const data = resp.data as Partial<PlantDetail>;

                if (!data?.scientificName) {
                    setCommonName("식별 실패");
                    return;
                }

                setScientificName(data.scientificName);
                setCommonName(data.commonName || "확실하지 않아요");
            })
            .catch(() => setCommonName("식별 실패"));

    }, []);

    /**
     * 파일 input change 이벤트 처리
     */
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    /**
     * 모달 전체 초기화
     */
    const handleResetAll = () => {
        setImagePreview("noImage");
        if (fileInputRef.current) fileInputRef.current.value = "";

        setScientificName("");
        setCommonName("");
        setNickname("");
        setMemoText("");
        setMemoLines([]);
        setStartDate(today);
    };

    /**
     * 메모 입력 (최대 3줄 제한)
     */
    const MAX_LINES = 3;
    const updateMemoText = (value: string) => {
        const lines = value.split("\n");
        if (lines.length > MAX_LINES) {
            toast.warning(`메모는 최대 ${MAX_LINES}줄까지 입력 가능합니다.`);
            return;
        }
        setMemoText(value);

        // 항상 중앙 정렬로 설정
        setMemoLines(
            lines.map(text => ({
                text,
                align: "center"
            }))
        );
    };

    /**
     * 제출 → 부모 컴포넌트로 데이터 전달
     */
    const handleSubmit = () => {
        if (!scientificName) {
            alert("먼저 식물을 인식해주세요!");
            return;
        }

        const file = fileInputRef.current?.files?.[0];
        if (!file) {
            alert("식물 사진을 업로드해주세요!");
            return;
        }

        onSend?.({
            plantInfo: {
                nickname: nickname.trim() || undefined,
                plantScientificName: scientificName,
                memo: memoText,
                acquiredAt: startDate.toISOString().slice(0, 10)
            },
            file
        });
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="w-[460px] bg-white rounded-lg p-6 shadow-lg">

                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">새 식물 등록</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        ✕
                    </button>
                </div>

                {/* 이미지 업로드 + 미리보기 */}
                <PlantImageUploader
                    mode={"plant"}
                    imagePreview={imagePreview}
                    isDragging={isDragging}
                    isPortrait={isPortrait}
                    commonName={commonName}
                    nickname={nickname}
                    memoLines={memoLines}
                    onImageChange={handleImageChange}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) handleFile(file);
                    }}
                    onClearImage={handleResetAll}
                    fileInputRef={fileInputRef}
                />

                {/* 인식 결과 Common Name 표시 */}
                {commonName && (
                    <p className="text-center text-sm text-green-700 font-medium mb-3">
                        {commonName}
                    </p>
                )}

                {/* 사용자 입력 별명 */}
                <PlantNicknameEditor
                    nickname={nickname}
                    onChangeNickname={setNickname}
                />

                {/* 키운 날짜 선택 */}
                <div className="mb-4">
                    <Label className="block mb-1 text-sm font-medium">키운 날짜</Label>
                    <CustomDatePicker
                        value={startDate}
                        onChange={(date) => setStartDate(date ?? today)}
                    />
                </div>

                {/* 메모 입력 */}
                <PlantMemoEditor memoText={memoText} onChangeMemoText={updateMemoText} />

                {/* 하단 버튼(초기화/등록) */}
                <PlantCreateModalFooter
                    onResetAll={handleResetAll}
                    onSubmit={handleSubmit}
                />

            </div>
        </div>
    );
}
