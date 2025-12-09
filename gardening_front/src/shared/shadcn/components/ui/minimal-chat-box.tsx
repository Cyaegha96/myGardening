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

    // ⬇️ 로딩 상태 (봇 응답 중) 가져오기
    const isLoading = useChatbotStore(s => s.isLoading);

    const navigate = useNavigate();
    const isLogin = Boolean(localStorage.getItem("accessToken"));

    // 🔽 자동 스크롤 ref 추가
    const scrollRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (isOpen && isLogin) {
            startSessionIfNeeded();
        }
    }, [isOpen]);

    // 🔽 메시지 추가되거나 로딩 시작되면 자동 스크롤
    React.useEffect(() => {
        scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages, isLoading]);

    const handleSend = () => {
        if (!input.trim() || !isLogin) return;
        send(input);
        setInput("");
    };

    const isMobile = window.innerWidth < 768;

    return (
        <MotionConfig>
            {/* Toggle Button */}
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
                    fixed z-[10000] flex flex-col bg-white shadow-2xl 
                    ${isMobile
                    ? "bottom-0 left-0 w-full h-[45vh] rounded-t-xl"
                    : "bottom-[calc(2rem+3.5rem)] right-[calc(2rem+3.5rem)] w-[360px] h-[420px] rounded-lg"
                }
                `}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-green-700 text-white">
                    <span className="font-medium">AI한테 물어보기</span>
                    <X className="cursor-pointer" onClick={() => setIsOpen(false)} />
                </div>

                {/* Message Area */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50 flex flex-col items-start"
                >
                    {!isLogin ? (
                        <div className="flex flex-col items-center justify-center text-center gap-3 mt-8 text-gray-500">
                            <p>로그인 후 AI 상담을 이용하실 수 있어요 🌱</p>
                            <div className="flex gap-2">
                                <Button onClick={() => navigate("/login")} className="bg-green-700 text-white">로그인</Button>
                                <Button onClick={() => navigate("/join")} variant="outline">회원가입</Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {messages.map((m, i) => (
                                <div
                                    key={i}
                                    className={`
                                        relative px-3 py-2 rounded-lg shadow-sm text-sm
                                        inline-block break-words
                                        max-w-[75%]
                                        ${m.sender === "user"
                                        ? "bg-secondary text-gray-900 self-end ml-auto"
                                        : "bg-green-100 text-green-800 self-start mr-auto"
                                    }
                                    `}
                                >
                                    {m.content}

                                    {/* 꼬리 */}
                                    {m.sender === "user" ? (
                                        <span className="absolute -right-1 bottom-2 w-3 h-3 bg-secondary rotate-45"></span>
                                    ) : (
                                        <span className="absolute -left-1 bottom-2 w-3 h-3 bg-green-100 rotate-45"></span>
                                    )}
                                </div>
                            ))}

                            {/* 👇 봇 입력중 표시 */}
                            {isLoading && (
                                <div className="
        bg-green-100 text-green-800 px-3 py-2 rounded-lg shadow-sm text-sm
        self-start mr-auto relative
    ">
        <span className="flex gap-1">
            <span className="animate-bounce">.</span>
            <span className="animate-bounce" style={{ animationDelay: "0.15s" }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: "0.3s" }}>.</span>
        </span>
                                    <span className="absolute -left-1 bottom-2 w-3 h-3 bg-green-100 rotate-45"></span>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Input Box */}
                <div className="flex items-center gap-2 px-3 py-2 bg-white border-t">
                    {isLogin ? (
                        <>
                            <Button size="icon" variant="ghost" className="text-gray-500">
                                <Image size={22} />
                            </Button>
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                className="flex-1 h-10"
                                placeholder="메시지를 입력하세요..."
                            />
                            <Button
                                size="icon"
                                onClick={handleSend}
                                className="bg-green-700 hover:bg-green-800 text-white"
                            >
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
