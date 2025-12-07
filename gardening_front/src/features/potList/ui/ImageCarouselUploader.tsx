import React, {useEffect, useRef, useState} from "react";
import type {PotListImageDTO} from "@/shared/api";
import {plantTagApi} from "@/entities/plantTag/api/plantTagApi.ts";
import {usePotListStore} from "@/entities/potList/model/potListStore.ts";
import {usePotListWriteStore} from "@/entities/potList/model/potListWriteStore.ts";

export const MAX_FILES = 10;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export type CarouselItem =
    | { type: "existing"; data: PotListImageDTO }
    | { type: "new"; file: File; preview: string }
    | { type: "empty" };

interface ImageCarouselUploaderProps {
    existingImages: PotListImageDTO[];
    newFiles: File[];
    thumbnailIndex: number | null;

    onChange: (payload: {
        updatedExistingImages: PotListImageDTO[];
        updatedNewFiles: File[];
        updatedThumbnailIndex: number | null;
        updatedDeletedIds: number[];
        updatedItems: CarouselItem[];
    }) => void;
}

export default function ImageCarouselUploader({
                                                  existingImages,
                                                  newFiles,
                                                  thumbnailIndex,
                                                  onChange,
                                              }: ImageCarouselUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [items, setItems] = useState<CarouselItem[]>([]);
    const [deletedIds, setDeletedIds] = useState<number[]>([]);
    const createdPreviewsRef = useRef<string[]>([]);
    const tagList = usePotListStore(state => state.tagFilterList);
    const addTag = usePotListWriteStore(state => state.addTag);

    // 초기 items 구성
    useEffect(() => {
        createdPreviewsRef.current.forEach((u) => {
            try {
                URL.revokeObjectURL(u);
            } catch { /* ignore */
            }
        });
        createdPreviewsRef.current = [];

        const initial: CarouselItem[] = [
            ...existingImages.map((img) => ({type: "existing", data: img} as CarouselItem)),
            ...newFiles.map((f) => {
                const prev = URL.createObjectURL(f);
                createdPreviewsRef.current.push(prev);
                return {type: "new", file: f, preview: prev} as CarouselItem;
            }),
        ];

        if (initial.length < MAX_FILES) initial.push({type: "empty"});

        setItems(initial);
    }, [existingImages, newFiles]);

    // unmount cleanup
    useEffect(() => {
        return () => {
            createdPreviewsRef.current.forEach((u) => {
                try {
                    URL.revokeObjectURL(u);
                } catch { /* ignore */
                }
            });
            createdPreviewsRef.current = [];
        };
    }, []);

    const emitChange = (updated: CarouselItem[]) => {
        const updatedExisting = updated
            .filter((x) => x.type === "existing")
            .map((x) => (x as any).data as PotListImageDTO);

        const updatedNewFiles = updated
            .filter((x) => x.type === "new")
            .map((x) => (x as any).file as File);

        const newThumbnailIndex =
            updated.length > 0 && thumbnailIndex !== null && thumbnailIndex < updated.length
                ? thumbnailIndex
                : 0;

        onChange({
            updatedExistingImages: updatedExisting,
            updatedNewFiles,
            updatedThumbnailIndex: newThumbnailIndex,
            updatedDeletedIds: deletedIds,
            updatedItems: updated,
        });

        setItems(updated);
    };

    // 올린 이미지의 추천 카테고리(태그) 입력
    const setRecommendTags = async (file: File) => {
        const resp = await plantTagApi.recommendTags(file);
        const recommendTags = resp.data;

        recommendTags.forEach(tag => {
            const tagInfo = tagList
                .flatMap(parent => parent.tagList)      // 모든 자식 태그를 한 배열로
                .find(item => item.tagName === tag);

            if(tagInfo && tagInfo.tagId){
                addTag(tagInfo.tagId);
            }
        });
    }

    // 단일 파일 선택 (파일 input)
    const handleFileSelect = async (file: File, index: number) => {
        if (!file.type.startsWith("image/")) return alert("이미지 파일만 가능합니다.");
        if (file.size > MAX_FILE_SIZE) return alert("10MB 이하만 가능합니다.");

        const preview = URL.createObjectURL(file);
        createdPreviewsRef.current.push(preview);

        await setRecommendTags(file);

        const list = [...items];
        list[index] = {type: "new", file, preview};

        const filled = list.filter((x) => x.type !== "empty").length;
        if (filled < MAX_FILES && !list.some((x) => x.type === "empty")) {
            list.push({type: "empty"});
        }

        emitChange(list);
    };

    // 여러 파일을 넣는 공통 로직: index부터 채우거나 끝에 추가
    const handleFiles = async (files: File[], startIndex?: number) => {
        if (!files || files.length === 0) return;

        for (const f of files) {
            if (!f.type.startsWith("image/")) {
                alert("이미지 파일만 가능합니다.");
                return;
            }
            if (f.size > MAX_FILE_SIZE) {
                alert("10MB 이하만 가능합니다.");
                return;
            }
        }

        const occupied = items.filter((x) => x.type !== "empty").length;
        if (occupied + files.length > MAX_FILES) {
            alert(`이미지는 최대 ${MAX_FILES}장까지 업로드 가능합니다.`);
            return;
        }

        const list = [...items];

        let placeIndex = typeof startIndex === "number" ? startIndex : list.findIndex(x => x.type === "empty");
        if (placeIndex === -1) {
            placeIndex = list.length;
        }

        let insertPos = placeIndex;
        for (const f of files) {
            const preview = URL.createObjectURL(f);
            createdPreviewsRef.current.push(preview);

            await setRecommendTags(f);

            if (insertPos < list.length) {
                list[insertPos] = {type: "new", file: f, preview};
            } else {
                list.push({type: "new", file: f, preview});
            }
            insertPos += 1;
        }

        if (list.filter((x) => x.type !== "empty").length < MAX_FILES && !list.some(x => x.type === "empty")) {
            list.push({type: "empty"});
        }

        emitChange(list);
    };

    const openFileDialog = (index: number) => {
        if (!fileInputRef.current) return;
        fileInputRef.current.dataset.index = String(index);
        fileInputRef.current.click();
    };

    const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const idx = Number(fileInputRef.current?.dataset.index ?? -1);
        const files = e.target.files ? Array.from(e.target.files) : [];
        if (files.length === 0) return;
        if (files.length === 1 && idx >= 0) {
            handleFileSelect(files[0], idx);
        } else {
            // multiple selection -> place starting from idx if valid else append
            handleFiles(files, idx >= 0 ? idx : undefined);
        }
        // clear input so same-file can be reselected later
        e.currentTarget.value = "";
    };

    const handleDelete = (index: number) => {
        const list = [...items];
        const target = list[index];

        if (!target) return;

        if (target.type === "existing") {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            setDeletedIds((prev) => {
                if (prev.includes(target.data.id as number)) return prev;
                return [...prev, target.data.id];
            });
        } else if (target.type === "new") {
            // revoke preview
            try {
                URL.revokeObjectURL(target.preview);
                // remove from createdPreviewsRef as well
                createdPreviewsRef.current = createdPreviewsRef.current.filter(u => u !== target.preview);
            } catch { /* ignore */
            }
        }

        list.splice(index, 1);

        if (list.filter((x) => x.type !== "empty").length < MAX_FILES && !list.some((x) => x.type === "empty")) {
            list.push({type: "empty"});
        }

        emitChange(list);
    };

    // drag handlers for each slot (특히 empty 슬롯에 drop 허용)
    const onSlotDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
    };

    const onSlotDrop = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        const dt = e.dataTransfer;
        const files: File[] = [];
        if (dt.items) {
            // Chrome: items
            for (let i = 0; i < dt.items.length; i++) {
                const it = dt.items[i];
                if (it.kind === "file") {
                    const f = it.getAsFile();
                    if (f) files.push(f);
                }
            }
        } else if (dt.files) {
            for (let i = 0; i < dt.files.length; i++) files.push(dt.files[i]);
        }
        if (files.length > 0) handleFiles(files, index);
    };

    // optionally allow dropping onto entire carousel (append to first empty)
    const onCarouselDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
    };
    const onCarouselDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const dt = e.dataTransfer;
        const files: File[] = [];
        if (dt.items) {
            for (let i = 0; i < dt.items.length; i++) {
                const it = dt.items[i];
                if (it.kind === "file") {
                    const f = it.getAsFile();
                    if (f) files.push(f);
                }
            }
        } else if (dt.files) {
            for (let i = 0; i < dt.files.length; i++) files.push(dt.files[i]);
        }
        if (files.length > 0) handleFiles(files);
    };

    return (
        <div>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                multiple
                onChange={onFileInputChange}
            />

            <div
                className="flex gap-3 overflow-x-auto p-2 whitespace-nowrap"
                onDragOver={onCarouselDragOver}
                onDrop={onCarouselDrop}
            >
                {items.map((item, i) => (
                    <div
                        key={i}
                        className={
                            `relative w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 
                            border rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer
                            overflow-y-hidden shrink-0
                            ${thumbnailIndex === i && item.type !== "empty" ? "ring-2 ring-blue-500" : ""}`
                        }
                        onClick={() => {
                            if (item.type === "empty") {
                                openFileDialog(i);
                            } else {
                                // 썸네일 선택
                                onChange({
                                    updatedExistingImages: existingImages,
                                    updatedNewFiles: newFiles,
                                    updatedThumbnailIndex: i,
                                    updatedDeletedIds: deletedIds,
                                    updatedItems: items,
                                });
                            }
                        }}
                        onDragOver={(e) => onSlotDragOver(e, i)}
                        onDrop={(e) => onSlotDrop(e, i)}
                    >
                        {/* 삭제버튼 */}
                        {item.type !== "empty" && (
                            <button
                                onClick={(ev) => {
                                    ev.stopPropagation();
                                    handleDelete(i);
                                }}
                                className="absolute top-1 right-1 bg-black/60 text-white w-6 h-6 rounded-full flex items-center justify-center"
                                type="button"
                            >
                                ×
                            </button>
                        )}

                        {/* 대표 표시 */}
                        {thumbnailIndex === i && item.type !== "empty" && (
                            <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                대표
                            </div>
                        )}

                        {/* 이미지 / empty */}
                        {item.type === "empty" ? (
                            <div
                                className="flex flex-col items-center justify-center text-gray-400 pointer-events-none">
                                <div className="text-3xl">+</div>
                                <div className="text-sm">이미지 추가</div>
                                <div className="text-xs mt-1 text-gray-300">여기에 끌어다 놓기</div>
                            </div>
                        ) : (
                            <img
                                src={item.type === "new" ? item.preview : item.data.url}
                                className="w-full h-full object-cover rounded"
                                alt={`preview-${i}`}
                                draggable={false}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
