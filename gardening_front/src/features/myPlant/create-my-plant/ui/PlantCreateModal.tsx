import { useCallback, useEffect, useRef, useState } from "react";
import type { PlantCreateModalProps } from "@/features/myPlant/create-my-plant/model/PlantCreateModalProps.ts";

import PlantImageUploader from "@/features/myPlant/create-my-plant/ui/PlantImageUploader.tsx";
import PlantNicknameEditor from "@/features/myPlant/create-my-plant/ui/PlantNicknameEditor.tsx";
import PlantMemoEditor from "@/features/myPlant/create-my-plant/ui/PlantMemoEditor.tsx";
import PlantCreateModalFooter from "@/features/myPlant/create-my-plant/ui/PlantCreateModalFooter.tsx";

import type { MemoLine } from "@/entities/myPlant/model/MemoLine.ts";
import { Label } from "@/shared/shadcn/components/ui/label.tsx";
import CustomDatePicker from "@/entities/myPlant/ui/CustomDatePicker.tsx";

import { PlantInfoControllerApi } from "@/shared/api";
import type { PlantDetail } from "@/entities/searchPlant/searchPlantStore.ts";
import { toast } from "sonner";

export function PlantCreateModal({
                                     mode,
                                     defaultValues,
                                     onClose,
                                     onSend,
                                     onUpdate,
                                 }: PlantCreateModalProps) {

    const today = new Date();
    const [isLoading, setIsLoading] = useState(false);
    const [detectFailed, setDetectFailed] = useState(false);

    const [imagePreview, setImagePreview] = useState<string>("noImage");
    const [scientificName, setScientificName] = useState("");
    const [commonName, setCommonName] = useState("");

    const [nickname, setNickname] = useState("");
    const [memoText, setMemoText] = useState("");
    const [memoLines, setMemoLines] = useState<MemoLine[]>([]);
    const [startDate, setStartDate] = useState<Date>(today);
    const [isPortrait, setIsPortrait] = useState(true);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    /** 수정모드 데이터 세팅 */
    useEffect(() => {
        if (mode !== "edit" || !defaultValues) return;

        setImagePreview(defaultValues.imageUrl);
        setCommonName(defaultValues.commonName ?? "");
        setScientificName(defaultValues.scientificName ?? "");
        setNickname(defaultValues.nickname ?? "");
        setMemoText(defaultValues.memo ?? "");
        setStartDate(defaultValues.acquiredAt ? new Date(defaultValues.acquiredAt) : today);
    }, [mode, defaultValues]);

    /** AI 식별 */
    const analyzePlant = async (file: File) => {
        setIsLoading(true);
        setDetectFailed(false);

        const api = new PlantInfoControllerApi();

        try {
            const resp = await api.identifyPlantByPlantNetByFile(file);
            const data = resp.data as Partial<PlantDetail>;

            if (!data?.scientificName) {
                setDetectFailed(true);
                toast.error("식별에 성공하지 못했습니다. 다른 사진을 올려주세요!");
                return;
            }

            setScientificName(data.scientificName);
            setCommonName(data.commonName || "확실하지 않아요");
        } catch {
            setDetectFailed(true);
            toast.error("식물 분석 실패! 다시 시도해주세요");
        } finally {
            setIsLoading(false);
        }
    };

    /** 이미지 변경 처리 */
    const handleFile = useCallback((file: File) => {
        const preview = URL.createObjectURL(file);
        const img = new Image();
        img.src = preview;
        img.onload = () => {
            setIsPortrait(img.height >= img.width);
            setImagePreview(preview);
        };

        analyzePlant(file);
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    /** 메모 */
    const MAX_LINES = 3;
    const updateMemoText = (value: string) => {
        const lines = value.split("\n");
        if (lines.length > MAX_LINES) {
            toast.warning(`메모는 최대 ${MAX_LINES}줄까지 입력 가능`);
            return;
        }
        setMemoText(value);
        setMemoLines(lines.map(text => ({ text, align: "center" })));
    };

    /** 이미지 제거 */
    const clearImage = () => {
        setImagePreview("noImage");
        setScientificName("");
        setCommonName("");
        setDetectFailed(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    /** 제출 */
    const handleSubmit = () => {
        const file = fileInputRef.current?.files?.[0];

        // 🔹 등록 모드 → 반드시 식별 성공해야 저장 가능
        if (mode === "create") {
            if (!file) {
                toast.error("이미지를 업로드해주세요!");
                return;
            }
            if (detectFailed || !scientificName) {
                toast.error("식물 분석 실패! 다른 사진으로 시도해주세요.");
                return;
            }

            onSend?.({
                plantInfo: {
                    plantScientificName: scientificName,
                    nickname: nickname.trim() || undefined,
                    memo: memoText.trim() || undefined,
                    acquiredAt: startDate.toISOString().slice(0, 10),
                },
                file,
            });
            return;
        }

        // 🔹 수정 모드 → 파일 없어도 기존 정보로 수정 허용
        onUpdate?.({
            plantInfo: {
                userPlantId: defaultValues!.userPlantId,
                plantScientificName: scientificName,
                nickname: nickname.trim() || undefined,
                memo: memoText.trim() || undefined,
                acquiredAt: startDate.toISOString().slice(0, 10),
            },
            file: file ?? undefined,
        });
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            {/* 분석 로딩 */}
            {isLoading && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center font-bold text-white text-lg backdrop-blur-sm">
                    식물 분석 중...
                </div>
            )}

            <div className="w-[460px] bg-white rounded-lg p-6 shadow-lg relative">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">
                        {mode === "edit" ? "식물 정보 수정" : "새 식물 등록"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                <PlantImageUploader
                    mode="plant"
                    imagePreview={imagePreview}
                    isPortrait={isPortrait}
                    commonName={commonName}
                    nickname={nickname}
                    memoLines={memoLines}
                    onImageChange={handleImageChange}
                    onClearImage={clearImage}
                    fileInputRef={fileInputRef}
                />

                {/* 🔥 식별 실패 메시지 */}
                {detectFailed && (
                    <p className="text-center text-sm text-red-600 font-semibold my-2">
                        식별 실패! 더 선명한 사진을 업로드해주세요!
                    </p>
                )}

                {commonName && !detectFailed && (
                    <p className="text-center text-sm text-green-700 font-medium mb-3">
                        {commonName}
                    </p>
                )}

                <PlantNicknameEditor
                    nickname={nickname}
                    onChangeNickname={setNickname}
                />

                <div className="mb-4">
                    <Label className="block mb-1 text-sm font-medium">키운 날짜</Label>
                    <CustomDatePicker
                        value={startDate}
                        onChange={(date) => setStartDate(date ?? today)}
                    />
                </div>

                <PlantMemoEditor
                    memoText={memoText}
                    onChangeMemoText={updateMemoText}
                />

                <PlantCreateModalFooter
                    mode={mode}
                    onSubmit={handleSubmit}
                    onResetAll={mode === "create" ? clearImage : undefined}
                />
            </div>
        </div>
    );
}
