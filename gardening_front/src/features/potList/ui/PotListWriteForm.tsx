import React, {useEffect} from "react";
import {Input} from "@/shared/shadcn/components/ui/input";
import {Button} from "@/shared/shadcn/components/ui/button";
import {Label} from "@/shared/shadcn/components/ui/label";
import {Card, CardContent} from "@/shared/shadcn/components/ui/card";
import {Checkbox} from "@/shared/shadcn/components/ui/checkbox.tsx";
import ImageCarouselUploader from "@/features/potList/ui/ImageCarouselUploader.tsx";
import {Editor} from "@/shared/shadcn/components/editor/blocks/editor-x/editor.tsx";
import {CornerDownLeft} from "lucide-react";
import {usePotListWriteStore} from "@/entities/potList/model/potListWriteStore.ts";
import {useNavigate, useParams} from "react-router-dom";
import {RadioGroup, RadioGroupItem} from "@/shared/shadcn/components/ui/radio-group.tsx";
import {usePotListStore} from "@/entities/potList/model/potListStore.ts";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/shared/shadcn/components/ui/accordion.tsx";
import {formatPrice} from "@/entities/potList/libs/formatPrice.ts";

type Props = {
    mode: "create" | "edit";
};

export default function PotListWriteForm({mode}: Props) {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const tagList = usePotListStore(state => state.tagFilterList);
    const fetchPotTagList = usePotListStore(state => state.fetchPotTagList);
    const {
        title, setTitle,
        description, setDescription,
        type, setType,
        price, setPrice,
        isFree, setIsFree,
        tags, toggleTag,
        location, setLocation,
        existingImages, setExistingImages,
        newFiles, setNewFiles,
        thumbnailIndex, setThumbnailIndex,
        setToDeleteImageIds,
        loading,
        reset, submit
    } = usePotListWriteStore();

    const onSubmitSuccess = () => {
        if (mode === "create") {
            navigate("/pot-list");
        } else {
            navigate(`/pot-list/${id}`);
        }
    }

    useEffect(() => {
        console.log(mode);
        if (mode === "create") {
            reset();
        }
    }, [mode, reset]);

    useEffect(() => {
        if (!tagList || tagList.length === 0) {
            fetchPotTagList();
        }
    }, [fetchPotTagList, tagList]);

    const openDaumPost = () => {
        if (!window.daum?.Postcode) {
            alert("우편번호 서비스 로드 실패");
            return;
        }
        new window.daum.Postcode({
            oncomplete: (data: any) => setLocation(data.jibunAddress || data.autoJibunAddress || "")
        }).open();
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^\d]/g, ""); // 숫자만
        let num = Number(raw || 0);

        if (num > 100000000) {
            num = 100000000;
        }

        setPrice(Number(num || 0));
    };

    return (
        <>
            <div className="text-2xl flex justify-center mb-5 font-bold">
                {mode === "create" ? "분양글 작성 🌿" : "분양글 수정 🌿"}
            </div>
            <Card className="shadow-lg">
                <CardContent className="space-y-3">

                    {/* 유형 라디오 버튼 */}
                    <div>
                        <RadioGroup
                            value={type}
                            onValueChange={(v) => {
                                setType(v as "SELL" | "BUY");
                                setPrice(0);
                            }
                            }
                            className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <RadioGroupItem value="SELL" id="type-sell"/>
                                <label htmlFor="type-sell" className="cursor-pointer select-none">판매</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <RadioGroupItem value="BUY" id="type-buy"/>
                                <label htmlFor="type-buy" className="cursor-pointer select-none">구매</label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* 제목 */}
                    <div className="mb-5">
                        <Label className="mb-1 text-md">제목</Label>
                        <Input value={title} onChange={e => setTitle(e.target.value)}/>
                    </div>

                    {/* 가격 */}
                    <div>
                        <Label className="mb-1 text-md">가격</Label>
                        <div className="flex items-center gap-3 mb-5">
                            <Input
                                type="text"
                                value={formatPrice(price, "\\ ")}
                                onChange={handlePriceChange}
                                disabled={isFree || type === "BUY"}
                                className="w-40"
                            />
                            <div className="flex items-center gap-2 cursor-pointer">
                                <Checkbox
                                    id="freeCheck"
                                    checked={isFree}
                                    onCheckedChange={(checked) => {
                                        setIsFree(Boolean(checked));
                                        if (checked) setPrice(0);
                                    }}
                                    disabled={type === "BUY"}
                                />
                                <label htmlFor="freeCheck" className="cursor-pointer select-none text-sm">
                                    무료 나눔
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* 카테고리 */}
                    <div>
                        <Label className="mb-1 text-md">카테고리</Label>
                        <Accordion type="multiple"
                                   className="w-full bg-background rounded-lg border shadow px-2 py-1 mb-3">
                            {tagList.map(cat => (
                                <AccordionItem key={cat.parentTag.tagId} value={String(cat.parentTag.tagId)}
                                               className="border-0 mb-1">
                                    <AccordionTrigger
                                        className="text-left gap-2 cursor-pointer hover:bg-accent/50 rounded-sm hover:no-underline px-1 py-1">
                                        {cat.parentTag.description}
                                    </AccordionTrigger>

                                    <AccordionContent>
                                        <div className="space-y-2 ps-2">
                                            {cat.tagList.map(tag => (
                                                <label
                                                    key={tag.tagId}
                                                    className="flex items-center gap-2 cursor-pointer hover:bg-accent/50 rounded-sm px-1 py-1"
                                                >
                                                    <Checkbox
                                                        checked={tags.includes(tag.tagId!)}
                                                        onCheckedChange={() => toggleTag(tag.tagId!)}
                                                    />
                                                    <span>{tag.tagName}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>

                        {/* 선택된 태그 표시 */}
                        <div className="flex flex-wrap gap-2 mb-5">
                            {tagList.flatMap(cat => cat.tagList)
                                .filter(tag => tags.includes(tag.tagId!))
                                .map(tag => (
                                    <div
                                        key={tag.tagId}
                                        className="bg-secondary text-background-foreground px-2 py-1 rounded-full text-sm flex items-center gap-1 cursor-pointer hover:bg-accent/50"
                                        onClick={() => toggleTag(tag.tagId!)}
                                    >
                                        {tag.tagName} &times;
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    {/* 위치 */}
                    <div>
                        <Label className="mb-1 text-md">거래 위치</Label>
                        <Input
                            value={location}
                            placeholder="여기를 눌러 주소를 입력하세요."
                            onChange={e => setLocation(e.target.value)}
                            onClick={openDaumPost}
                            readOnly
                        />
                    </div>

                    {/* 이미지 */}
                    <div className="mb-5">
                        <ImageCarouselUploader
                            existingImages={existingImages}
                            newFiles={newFiles}
                            thumbnailIndex={thumbnailIndex}
                            onChange={({
                                           updatedExistingImages,
                                           updatedNewFiles,
                                           updatedThumbnailIndex,
                                           updatedDeletedIds
                                       }) => {
                                setExistingImages(updatedExistingImages);
                                setNewFiles(updatedNewFiles);
                                setThumbnailIndex(updatedThumbnailIndex ?? 0);
                                setToDeleteImageIds(updatedDeletedIds);
                            }}
                        />
                    </div>

                    {/* 내용 */}
                    <div>
                        <Label className="mb-1 text-md">분양 설명</Label>
                        <Editor
                            reset={mode !== "edit"}
                            editorSerializedState={description}
                            onSerializedChange={(value) => setDescription(value)}
                        />
                    </div>

                    <div className="flex justify-end mt-5">
                        <Button onClick={() => submit(mode, id ? Number(id) : undefined, onSubmitSuccess)}
                                disabled={loading}>
                            {loading ? "처리중..." : mode === "create" ? "작성하기" : "수정하기"}<CornerDownLeft/>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
