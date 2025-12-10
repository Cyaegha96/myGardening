import * as React from "react"
import {motion, MotionConfig} from "framer-motion"
import {Input} from "@/shared/shadcn/components/ui/input"
import {BotMessageSquare, Send, X} from "lucide-react"
import {Button} from "@/shared/shadcn/components/ui/button.tsx";
import {useEffect} from "react";

const transition = {
    type: "spring",
    bounce: 0,
    duration: 0.3,
}

export default function MinimalChatBox() {
    const [isOpen, setIsOpen] = React.useState(false)
    const [messages, setMessages] = React.useState<string[]>([])
    const [input, setInput] = React.useState("")

    const chatRef = React.useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                isOpen &&
                chatRef.current &&
                !chatRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isOpen])

    const handleSend = () => {
        if (input.trim()) {
            setMessages((prev) => [...prev, input.trim()])
            setInput("")
        }
    }

    return (
        <MotionConfig transition={transition}>
            <div className="fixed bottom-8 right-23 md:right-27 z-50 ms-2 md:ms-0">
                <motion.div
                    ref={chatRef}
                    animate={{
                        height: isOpen ? "400px" : "0px",
                        width: isOpen ? "100%" : "0px",
                    }}
                    initial={false}
                    className={"flex flex-col shadow-md overflow-hidden bg-white rounded-md"}
                >
                    {/* Header */}
                    <div className={"flex items-center justify-between px-4 py-2 bg-green-700"}>
                        {isOpen && <span className="font-medium text-white">AI한테 물어보기</span>}
                        <div
                            className="flex items-center justify-center w-8 h-8 rounded"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50">
                                <Button
                                    className="cursor-pointer relative bg-green-700 hover:bg-green-800 text-white rounded-full shadow-lg w-14 h-14 md:w-16 md:h-16 transition-transform hover:scale-105">
                                    {!isOpen ?
                                        <BotMessageSquare className="size-5 md:size-6"/>
                                        :
                                        <X className="size-5 md:size-6"/>
                                    }
                                </Button>
                            </div>
                            {isOpen && <X size={18} className="cursor-pointer text-white"/>}
                        </div>
                    </div>

                    {/* Messages */}
                    {isOpen && (
                        <div className="flex-1 px-4 py-2 overflow-y-auto flex flex-col gap-2 bg-white">
                            {messages.length === 0 ? (
                                <span className="text-gray-400 text-sm">아직 보낸 메시지가 없습니다.</span>
                            ) : (
                                messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className="self-start bg-gray-100 text-gray-900 px-3 py-2 rounded text-sm max-w-[85%]"
                                    >
                                        {msg}
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Input */}
                    {isOpen && (
                        <div
                            className="flex items-center gap-2 px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                            <Input
                                className="flex-1 h-10 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-1 focus:ring-gray-500 focus:border-gray-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                                placeholder="메시지를 입력하세요..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            />
                            <div
                                className="flex items-center justify-center w-10 h-10 rounded-md cursor-pointer bg-green-700 hover:bg-green-800"
                                onClick={handleSend}
                            >
                                <Send size={18} className="text-white"/>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </MotionConfig>
    )
}
