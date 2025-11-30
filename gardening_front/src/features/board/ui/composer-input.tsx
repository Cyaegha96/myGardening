import * as React from "react"
import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CornerDownLeft, Image as ImageIcon, X } from "lucide-react"
import { Button } from "@/shared/shadcn/components/ui/button"
import { Textarea } from "@/shared/shadcn/components/ui/textarea"
import { type BoardRequestDTO, PlantTagControllerApi } from "@/shared/api"
import type { ComposerProps } from "@/features/board/model/ComposerProps"
import {useNavigate} from "react-router-dom";

// uuid 대체용
const simpleId = () => Math.random().toString(36).slice(2, 11)

export function ComposerInput({
                                  onSend,
                                  initialTitle,
                                  initialContents,
                                  initialTags,
                                  initialImages,
                                  boardId
                              }: ComposerProps) {

    // 초기 상태값 설정
    const [title, setTitle] = useState(initialTitle ?? "")
    const [content, setContent] = useState(initialContents ?? "")
    const [tags, setTags] = useState<string[]>(initialTags ?? [])
    const [tagInput, setTagInput] = useState("")

    // attachments:
    // file === null → 기존 이미지 유지 (수정모드)
    // file !== null → 새로 업로드한 파일
    const [attachments, setAttachments] = useState<
        { id: string; file: File | null; preview: string; keep?: boolean }[]
    >([])

    const [tagLoading, setTagLoading] = useState(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const navigate = useNavigate();
    const isEdit = Boolean(initialTitle); // 수정모드 판단

    // 수정모드(initialImages)일 때 기존 이미지 첨부
    useEffect(() => {
        if (!initialImages) return

        const presets = initialImages.map(img => ({
            id: String(img.id),
            file: null,
            preview: img.url,
            keep: true      // 기존 파일 유지용 플래그
        }))

        setAttachments(presets)
    }, [initialImages])

    // 자동 태그 추천
    useEffect(() => {
        // 새로 업로드된 파일이 없으면 실행하지 않음
        const latest = attachments.find(a => a.file !== null);

        if (!latest) {
            // 최신 파일이 없으면 tagLoading을 OFF 해서 버튼 풀기
            setTagLoading(false);
            return;
        }

        const fetchTags = async () => {
            try {
                setTagLoading(true);
                const plantTag = new PlantTagControllerApi();
                const res = await plantTag.recommendTags(latest.file!, "flower");
                // 태그 세팅 ( 중복 제거하고 기존 입력한 태그 유지 )
                setTags(prev => {
                    const newTags = res.data ?? [];
                    const merged = [...prev];

                    newTags.forEach(t => {
                        if (!merged.includes(t)) merged.push(t);
                    });

                    return merged;
                });
            } catch (err) {
                console.error("추천 태그 실패:", err);
            } finally {
                setTagLoading(false);
            }
        };

        fetchTags();
    }, [attachments]);


    // 새 파일 업로드
    const handleFiles = (files: FileList | null) => {
        if (!files) return

        const incoming = Array.from(files)

        // 이미지 최대 3개
        if (attachments.length + incoming.length > 3) {
            alert("이미지는 최대 3장까지 업로드할 수 있습니다.")
            return
        }

        const list = incoming.map(file => ({
            id: simpleId(),
            file,
            preview: URL.createObjectURL(file)
        }))

        setAttachments(prev => [...prev, ...list])
    }

    // 파일 삭제
    const removeAttachment = (id: string) => {
        setAttachments(prev => prev.filter(a => a.id !== id))
    }

    // 태그 추가
    const addTag = () => {
        const t = tagInput.trim()
        if (!t) return
        if (tags.includes(t)) return
        setTags(prev => [...prev, t])
        setTagInput("")
    }

    const handleEnterTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") addTag()
    }

    // 부모로 전달 (등록 + 수정 공통)
    const sendHandler = () => {
        if (!title.trim()) {
            alert("제목은 필수 입력 항목입니다.")
            return
        }

        if (!content.trim()) {
            alert("내용은 필수 입력 항목입니다.")
            return
        }

        const boardInfo: BoardRequestDTO = {
            id: boardId ?? undefined,
            title,
            contents: content,
            tags,
            keepFileIds: attachments
                .filter(a => a.keep)          // 기존 파일
                .map(a => Number(a.id))       // id만 보내기
        }

        const newFiles = attachments
            .filter(a => a.file !== null)
            .map(a => a.file!)               // 새 파일들만 전송

        onSend({
            boardInfo,
            files: newFiles
        })
    }

    return (
        <div className="flex flex-col w-full rounded-xl border bg-card text-card-foreground shadow-sm">

            {/* 제목 영역 */}
            <div className="p-3 border-b flex items-center gap-2">
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목을 입력하세요"
                    maxLength={200}
                    className="flex-1 p-2 rounded-md border outline-none"
                />

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <ImageIcon className="h-5 w-5" />
                </Button>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                        handleFiles(e.target.files)
                        e.target.value = ""
                    }}
                />
            </div>

            {/* 본문 */}
            <div className="p-3">
                <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="내용을 입력하세요..."
                    className="min-h-[140px] border-0 p-2 focus-visible:ring-0 bg-background"
                    maxLength={4000}
                />
            </div>

            {/* 이미지 미리보기 */}
            {attachments.length > 0 && (
                <div className="px-4 pb-2">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        <AnimatePresence>
                            {attachments.map(att => (
                                <motion.div
                                    key={att.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                                    className="relative group"
                                >
                                    <div className="aspect-square w-full rounded-md overflow-hidden bg-muted">
                                        <img
                                            src={att.preview}
                                            alt={att.file ? att.file.name : "preset-image"}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    <button
                                        onClick={() => removeAttachment(att.id)}
                                        className="absolute -top-1 -right-1 bg-background border rounded-full p-0.5 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {/* 태그 */}
            <div className="p-3 border-t space-y-3">
                <div className="flex gap-2">
                    <input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleEnterTag}
                        placeholder="태그 입력"
                        className="flex-1 p-2 border rounded-md outline-none"
                        disabled={tagLoading}
                    />
                    <Button onClick={addTag} disabled={tagLoading}>
                        추가
                    </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                    {tagLoading && (
                        <div className="text-sm text-gray-500 animate-pulse">
                            🌿 태그 분석 중입니다...
                        </div>
                    )}

                    {tags.map(t => (
                        <span
                            key={t}
                            className="bg-primary/20 px-3 py-1 rounded-full flex items-center gap-2"
                        >
                            {t}
                            <X
                                className="h-3 w-3 cursor-pointer text-destructive"
                                onClick={() => setTags(tags.filter(tag => tag !== t))}
                            />
                        </span>
                    ))}
                </div>

                <div className="flex justify-end gap-2">
                    {isEdit && (
                        <Button
                            variant="outline"
                            onClick={() => navigate(`/board/${boardId}`)}
                        >
                            취소
                        </Button>
                    )}

                    <Button onClick={sendHandler}>
                        {isEdit ? "수정하기" : "작성하기"}
                        <CornerDownLeft className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
