import * as React from "react"
import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CornerDownLeft, Image as ImageIcon, X } from "lucide-react"
import { Button } from "@/shared/shadcn/components/ui/button"
import { Textarea } from "@/shared/shadcn/components/ui/textarea"
import { type BoardRequestDTO, PlantTagControllerApi } from "@/shared/api"

// uuid 대체용
const simpleId = () => Math.random().toString(36).slice(2, 11)

export interface ComposerProps {
    onSend: (data: {
        boardInfo: BoardRequestDTO
        files: File[]
    }) => void | Promise<void>
}

export function ComposerInput({ onSend }: ComposerProps) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [attachments, setAttachments] = useState<
        { id: string; file: File; preview?: string }[]
    >([]);
    const [tagLoading, setTagLoading] = useState(false); // 태그 불러올 때 로딩


    const fileInputRef = React.useRef<HTMLInputElement>(null)

    // 자동 태그 추천
    useEffect(() => {
        if (attachments.length === 0) return;

        const fetchTags = async () => {
            try {
                setTagLoading(true); // 로딩 시작

                const plantTag = new PlantTagControllerApi()
                const res = await plantTag.recommendTags(
                    attachments[0].file,
                    "flower"
                )

                setTags(res.data)
            } catch (err) {
                console.error("추천 태그 로딩 실패:", err)
            } finally {
                setTagLoading(false); // 로딩 종료
            }
        }

        fetchTags()
    }, [attachments])


    // 이미지 업로드
    const handleFiles = (files: FileList | null) => {
        if (!files) return

        const incoming = Array.from(files)

        if (attachments.length + incoming.length > 3) {
            alert("이미지는 최대 3장까지 업로드할 수 있습니다.")
            return
        }

        const list = incoming.map((file) => ({
            id: simpleId(),
            file,
            preview: URL.createObjectURL(file)
        }))

        setAttachments((prev) => [...prev, ...list])
    }

    const removeAttachment = (id: string) => {
        setAttachments((prev) => prev.filter((a) => a.id !== id))
    }

    // 태그 추가
    const addTag = () => {
        const t = tagInput.trim()
        if (!t) return
        if (tags.includes(t)) return
        setTags((prev) => [...prev, t])
        setTagInput("")
    }

    const handleEnterTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            addTag()
        }
    }

    // 부모로 전달
    const insertHandler = () => {
        // 필수값 검증
        if (!title.trim()) {
            alert("제목은 필수 입력 항목입니다.")
            return
        }

        if (!content.trim()) {
            alert("내용은 필수 입력 항목입니다.")
            return
        }

        // 글자수 제한
        if (title.length > 200) {
            alert(`제목은 200자 이내로 입력해야 합니다. (현재 ${title.length}자)`)
            return
        }

        if (content.length > 4000) {
            alert(`내용은 4000자 이내로 입력해야 합니다. (현재 ${content.length}자)`)
            return
        }

        const boardInfo: BoardRequestDTO = {
            title,
            contents: content,
            tags,
            keepFileIds: [],
        }

        onSend({
            boardInfo,
            files: attachments.map((a) => a.file)
        })
    }

    return (
        <div className="flex flex-col w-full rounded-xl border bg-card text-card-foreground shadow-sm">

            {/* 제목 + 이미지 버튼 */}
            <div className="p-3 border-b flex items-center gap-2">
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목을 입력하세요"
                    maxLength={200} // 글자수 제한
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
                    className="hidden"
                    multiple
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
                    maxLength={4000} // 글자수 제한
                    className="min-h-[140px] border-0 p-2 focus-visible:ring-0 bg-background"
                />
            </div>

            {/* 이미지 미리보기 */}
            {attachments.length > 0 && (
                <div className="px-4 pb-2">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        <AnimatePresence>
                            {attachments.map((att) => (
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
                                            alt={att.file.name}
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

            {/* 태그 입력 */}
            <div className="p-3 border-t space-y-3">
                <div className="flex gap-2">
                    <input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleEnterTag}
                        placeholder="태그 입력"
                        className="flex-1 p-2 border rounded-md outline-none"
                        disabled={tagLoading} // 로딩 중일 때 태그 입력 막기
                    />
                    <Button onClick={addTag} disabled={tagLoading}>추가</Button>
                </div>

                <div className="flex flex-wrap gap-2">
                    {/* 태그 분석 로딩 */}
                    {tagLoading && (
                        <div className="text-sm text-gray-500 animate-pulse">
                            🌿 태그 분석 중입니다...
                        </div>
                    )}

                    {tags.map((t) => (
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

                <div className="flex justify-end">
                    <Button onClick={insertHandler}>
                        작성하기
                        <CornerDownLeft className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
