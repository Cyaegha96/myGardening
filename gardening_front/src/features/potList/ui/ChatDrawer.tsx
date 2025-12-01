import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/shared/shadcn/components/ui/sheet.tsx";
import {Button} from "@/shared/shadcn/components/ui/button.tsx";
import {MessageCircle} from "lucide-react";
import {Badge} from "@/shared/shadcn/components/ui/badge.tsx";
import {useState} from "react";

type ChatMessage = { id: number; text: string; sender: "user" | "bot" };
type ChatRoom = { id: number; name: string; lastMessage: string; messages: ChatMessage[] };

export default function ChatDrawer() {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
    const [input, setInput] = useState("");

    // 더미 채팅방 데이터
    const chatRooms: ChatRoom[] = [
        {
            id: 1,
            name: "식물 상담방 1",
            lastMessage: "보통 하루 한 번 아침에 주세요.",
            messages: [
                {id: 1, text: "안녕하세요!", sender: "bot"},
                {id: 2, text: "물 주기는 어떻게 하나요?", sender: "user"},
                {id: 3, text: "보통 하루 한 번 아침에 주세요.", sender: "bot"},
            ],
        },
        {
            id: 2,
            name: "식물 상담방 2",
            lastMessage: "알겠습니다!",
            messages: [
                {id: 1, text: "식물 종류가 뭐예요?", sender: "user"},
                {id: 2, text: "몬스테라입니다.", sender: "bot"},
                {id: 3, text: "알겠습니다!", sender: "bot"},
            ],
        },
    ];

    const sendMessage = () => {
        if (!input.trim() || !selectedRoom) return;

        const newMessage: ChatMessage = {id: Date.now(), text: input, sender: "user"};
        selectedRoom.messages.push(newMessage);
        setInput("");

        // 봇 자동 응답 예시
        setTimeout(() => {
            selectedRoom.messages.push({id: Date.now() + 1, text: "확인했습니다!", sender: "bot"});
            setSelectedRoom({...selectedRoom});
        }, 500);

        setSelectedRoom({...selectedRoom});
    };

    return (
        <div className="fixed right-20 bottom-15 z-10">
            <Sheet
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
            >
                <SheetTrigger asChild>
                    <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50">
                        <Button
                            className="relative bg-green-700 hover:bg-green-800 text-white rounded-full shadow-lg w-14 h-14 md:w-16 md:h-16 transition-transform hover:scale-105"
                            aria-label="채팅하기"
                        >
                            <MessageCircle className="size-5 md:size-6"/>
                            {/* 알림 뱃지 */}
                            <Badge className="absolute top-0 right-0 w-5 h-5 md:w-6 md:h-6" variant="destructive">
                                3
                            </Badge>
                        </Button>
                    </div>
                </SheetTrigger>

                <SheetContent
                    side="right"
                    className="min-w-full md:min-w-1/3 flex flex-col"
                    onCloseAutoFocus={() => setSelectedRoom(null)}
                >
                    <SheetHeader>
                        <SheetTitle>
                            {selectedRoom ? (
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSelectedRoom(null)}
                                    >
                                        ←
                                    </Button>
                                    {selectedRoom.name}
                                </div>
                            ) : (
                                "채팅방 목록"
                            )}
                        </SheetTitle>
                    </SheetHeader>

                    {/* 채팅방 목록 화면 */}
                    {!selectedRoom && (
                        <div className="flex-1 overflow-y-auto p-2 space-y-2">
                            {chatRooms.map((room) => (
                                <div
                                    key={room.id}
                                    className="flex flex-col p-3 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer"
                                    onClick={() => setSelectedRoom(room)}
                                >
                                    <p className="font-semibold">{room.name}</p>
                                    <p className="text-sm text-gray-500 truncate">
                                        {room.lastMessage}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 채팅 상세 화면 */}
                    {selectedRoom && (
                        <div className="flex-1 flex flex-col">
                            <div
                                className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50 dark:bg-gray-900 rounded-md">
                                {selectedRoom.messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`max-w-[70%] px-4 py-2 rounded-lg ${
                                                msg.sender === "user"
                                                    ? "bg-green-700 text-white"
                                                    : "bg-gray-200 text-gray-900"
                                            }`}
                                        >
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* 입력창 */}
                            <div className="mt-2 p-2 flex gap-2 border-t border-gray-200 dark:border-gray-700">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="메시지를 입력하세요..."
                                    className="flex-1 px-3 py-2 border rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600"
                                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                />
                                <Button onClick={sendMessage} className="bg-green-700 hover:bg-green-800 text-white h-full">
                                    전송
                                </Button>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}