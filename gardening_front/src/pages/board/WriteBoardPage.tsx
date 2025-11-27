import { ComposerInput } from "@/features/board/ui/composer-input"
import { toast } from "sonner"
import { BoardControllerApi, type BoardRequestDTO } from "@/shared/api"

export default function WriteBoardPage() {

    const handleInsert = async (data: {
        boardInfo: BoardRequestDTO
        files: File[]
    }) => {
        console.log("Sending board:", data)

        const api = new BoardControllerApi()

        try {
            await api.insert(data.boardInfo, data.files)

            toast.success("Message Sent!", {
                description: `Your message and ${data.files.length} attachments have been sent.`,
                duration: 3000
            })
        } catch (error) {
            console.error("게시글 등록 실패:", error)

            toast.error("Error", {
                description: "메시지 전송 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
                duration: 3000
            })
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-4 flex flex-col items-center justify-center min-h-[400px]">
            <h2 className="text-2xl font-bold mb-4">글 남기기 🌿</h2>

            <ComposerInput
                onSend={handleInsert}
            />
        </div>
    )
}
