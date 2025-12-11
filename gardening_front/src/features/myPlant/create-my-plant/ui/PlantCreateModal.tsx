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
    const [plantScientificName, setPlantScientificName] = useState("");
    const [commonName, setCommonName] = useState("");

    const [nickname, setNickname] = useState("");
    const [memoText, setMemoText] = useState("");
    const [memoLines, setMemoLines] = useState<MemoLine[]>([]);
    const [startDate, setStartDate] = useState<Date>(today);
    const [file, setFile] = useState<File | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [isDragging, setIsDragging] = useState(false); // 드래그 상태

    const isSubmitDisabled =
        mode === "create"
            ? (!file || isLoading || detectFailed || !plantScientificName)
            : false;

    // 수정모드 데이터 세팅
    useEffect(() => {
        if (mode !== "edit" || !defaultValues) return;

        setImagePreview(defaultValues.imageUrl);
        setCommonName(defaultValues.commonName ?? "");
        setPlantScientificName(defaultValues.plantScientificName ?? "");
        setNickname(defaultValues.nickname ?? "");
        setMemoText(defaultValues.memo ?? "");
        setStartDate(defaultValues.acquiredAt ? new Date(defaultValues.acquiredAt) : today);
    }, [mode, defaultValues]);

    // AI 식별
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

            setPlantScientificName(data.scientificName);
            setCommonName(data.commonName || "확실하지 않아요");
        } catch {
            setDetectFailed(true);
            toast.error("식물 분석 실패! 다시 시도해주세요");
        } finally {
            setIsLoading(false);
        }
    };

    // 이미지 변경 처리
    const handleFile = useCallback((selectedFile: File) => {
        const preview = URL.createObjectURL(selectedFile);
        setFile(selectedFile);
        setImagePreview(preview);
        analyzePlant(selectedFile);
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) handleFile(selectedFile);
    };

    // 드래그 오버
    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    // 드래그 리브
    const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    // 드롭 처리
    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files?.[0];
        if (!droppedFile) return;
        if (!droppedFile.type.startsWith("image/")) {
            toast.error("이미지 파일만 업로드 가능합니다.");
            return;
        }

        handleFile(droppedFile);

        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // 메모
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

    // 이미지 제거
    const clearImage = () => {
        setImagePreview("noImage");
        setPlantScientificName("");
        setCommonName("");
        setDetectFailed(false);
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

// 제출
    const handleSubmit = () => {
        // create 모드에서 분석 중이면 저장 막기
        if (mode === "create" && isLoading) {
            toast.error("식물 분석이 끝난 후에 저장할 수 있습니다.");
            return;
        }

        // YYYY-MM-DD 포맷 안전 생성기
        const pad = (n: number) => String(n).padStart(2, "0");
        const year = startDate.getFullYear();
        const month = pad(startDate.getMonth() + 1);
        const day = pad(startDate.getDate());
        const formattedDate = `${year}-${month}-${day}`;

        // CREATE 모드
        if (mode === "create") {
            if (!file) {
                toast.error("이미지를 업로드해주세요!");
                return;
            }

            if (detectFailed || !plantScientificName) {
                toast.error("식물 분석 실패! 다른 사진으로 시도해주세요.");
                return;
            }

            console.log("acquiredAt(create):", formattedDate);

            onSend?.({
                plantInfo: {
                    plantScientificName,
                    nickname: nickname.trim() || undefined,
                    memo: memoText.trim() || undefined,
                    acquiredAt: formattedDate,   // ← 정답
                },
                file,
            });
            return;
        }

        // EDIT 모드
        console.log("acquiredAt(edit):", formattedDate);

        onUpdate?.({
            plantInfo: {
                userPlantId: defaultValues!.userPlantId,
                plantScientificName,
                nickname: nickname.trim() || undefined,
                memo: memoText.trim() || undefined,
                acquiredAt: formattedDate,   // ← EDIT도 동일하게 적용
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
                    fileInputRef={fileInputRef}
                    onImageChange={handleImageChange}
                    onClearImage={clearImage}
                    isDragging={isDragging}
                    commonName={commonName}
                    nickname={nickname}
                    memoLines={memoLines}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                />

                {/* 식별 상태 표시 */}
                {!detectFailed && (
                    <p className="text-center text-sm font-medium my-3">
                        {isLoading ? (
                            <span className="text-blue-600">🌿 학명 분석 중...</span>
                        ) : (
                            commonName && <span className="text-green-700">{commonName}</span>
                        )}
                    </p>
                )}

                {/* 식별 실패 메시지 */}
                {detectFailed && (
                    <p className="text-center text-sm text-red-600 font-semibold my-3">
                        식별 실패! 더 선명한 사진을 업로드해주세요!
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
                    disabled={isSubmitDisabled}
                />
            </div>
        </div>
    );
}
