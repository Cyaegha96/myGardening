import * as React from "react";
import { motion, MotionConfig } from "framer-motion";
import { Input } from "@/shared/shadcn/components/ui/input";
import { BotMessageSquare, Image, Send, X } from "lucide-react";
import { Button } from "@/shared/shadcn/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSendMessage } from "@/features/chatbot/send-message/useSendMessag.ts";
import useChatbotStore from "@/features/chatbot/model/chatbotStore.ts";

export default function MinimalChatBox() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [input, setInput] = React.useState("");

    const { send, startSessionIfNeeded } = useSendMessage();
    const messages = useChatbotStore(s => s.messages);
    const isLoading = useChatbotStore(s => s.isLoading);

    const navigate = useNavigate();
    const isLogin = Boolean(localStorage.getItem("accessToken"));

    const scrollRef = React.useRef<HTMLDivElement>(null);
    const isMobile = window.innerWidth < 768;

    // 파일 업로드 ref
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // 드래그 앤 드롭
    const [isDragging, setIsDragging] = React.useState(false);

    React.useEffect(() => {
        if (isOpen && isLogin) {
            startSessionIfNeeded();
        }
    }, [isOpen]);

    React.useEffect(() => {
        scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages, isLoading]);

    // 텍스트, 또는 텍스트 + 이미지 전송
    const handleSend = () => {
        if (!isLogin) return;
        if (!input.trim()) return;

        send(input);
        setInput("");
    };

    // 이미지 선택
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        send(input, file); // 텍스트가 있으면 같이 보냄
        setInput("");
        e.target.value = "";
    };

    // Drag Over
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    // Drag Leave
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    // Drop to upload
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (!isLogin) return;

        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
            send(input, file);
            setInput("");
        }
    };

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
        <MotionConfig>
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className="
                    bg-green-700 hover:bg-green-800 text-white rounded-full shadow-lg
                    fixed z-[50]
                    bottom-6 right-6
                    md:bottom-8 md:right-8
                    w-12 h-12 md:w-16 md:h-16
                "
            >
                {isOpen ? <X /> : <BotMessageSquare className="size-5 md:size-6" />}
            </Button>

            <motion.div
                animate={{
                    opacity: isOpen ? 1 : 0,
                    scale: isOpen ? 1 : 0.7,
                    x: isMobile ? 0 : "-1rem",
                    y: isMobile ? "0" : "3.5rem",
                }}
                initial={false}
                className={`
                    fixed z-[100] flex flex-col bg-white shadow-2xl
                    ${isMobile
                    ? "bottom-0 left-0 w-full h-[45vh] rounded-t-xl"
                    : "bottom-[calc(2rem+3.5rem)] right-[calc(2rem+3.5rem)] w-[360px] h-[420px] rounded-lg"
                }
                `}
            >

                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-green-700 text-white">
                    <span className="font-medium">🌿 마이가드닝 챗봇</span>
                    <X className="cursor-pointer" onClick={() => setIsOpen(false)} />
                </div>

                {/* Message List */}
                <div
                    ref={scrollRef}
                    className={`flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50 flex flex-col items-start relative
                        ${isDragging ? "bg-green-100/60" : ""}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    {isDragging && (
                        <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center bg-green-200/60 border-2 border-dashed border-green-500 rounded-md">
                            <p className="text-green-700 font-medium">여기에 이미지를 드롭하세요</p>
                        </div>
                    )}

                    {!isLogin ? (
                        <div className="flex flex-col items-center justify-center text-center gap-3 mt-8 text-gray-500">
                            <p>로그인 후 AI 상담 가능</p>
                            <div className="flex gap-2">
                                <Button className="bg-green-700 text-white" onClick={() => navigate("/login")}>로그인</Button>
                                <Button variant="outline" onClick={() => navigate("/join")}>회원가입</Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {messages.map((m, i) => {
                                const isUser = m.sender === "user";
                                const hasImage = !!m.url;
                                const hasText = !!m.content?.trim();

                                // 빈 메시지 제외
                                if (!hasImage && !hasText) return null;

                                // 봇은 이미지 전송하지 않음 → 즉시 제외
                                if (!isUser && hasImage) return null;

                                return (
                                    <div
                                        key={i}
                                        className={`
                                                        relative px-2 py-2 rounded-lg shadow-sm text-sm text-green-800 max-w-[75%]
                                                        ${isUser ? "bg-secondary self-end ml-auto" : "bg-green-100 self-start mr-auto"}
                                                    `}
                                    >
                                        {/* 이미지(사용자 메시지에만) */}
                                        {hasImage && isUser && (
                                            <img
                                                src={m.url}
                                                alt="uploaded"
                                                className="aspect-square max-w-[220px] max-h-[220px] rounded-md object-cover mb-1"
                                            />
                                        )}

                                        {/* 텍스트 있을 때만 */}
                                        {hasText && <span>{m.content}</span>}

                                        {/* 말풍선 꼬리 */}
                                        <span
                                            className={`
                                                        absolute bottom-2 w-3 h-3 rotate-45
                                                        ${isUser ? "bg-secondary -right-1" : "bg-green-100 -left-1"}
                                                    `}
                                        />
                                    </div>
                                );
                            })}

                            {isLoading && (
                                <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg shadow-sm text-sm self-start mr-auto relative">
                                    <span className="flex gap-1"> <span className="animate-bounce">.</span><span className="animate-bounce" style={{ animationDelay: "0.15s" }}>.</span><span className="animate-bounce" style={{ animationDelay: "0.3s" }}>.</span> </span>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Input */}
                <div className="flex items-center gap-2 px-3 py-2 bg-white border-t">
                    {isLogin ? (
                        <>
                            <Button variant="ghost" size="icon" className="text-gray-500" onClick={() => fileInputRef.current?.click()}>
                                <Image size={22} />
                            </Button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileSelect}
                            />

                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                className="flex-1 h-10"
                                placeholder="메시지를 입력하세요..."
                            />

                            <Button size="icon" className="bg-green-700 hover:bg-green-800 text-white" onClick={handleSend}>
                                <Send size={18} />
                            </Button>
                        </>
                    ) : (
                        <p className="w-full text-center text-xs text-gray-400">로그인 후 사용 가능</p>
                    )}
                </div>

            </motion.div>
        </MotionConfig>
    );
}
