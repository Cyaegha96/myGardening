import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/shared/shadcn/components/ui/sheet";
import { Button } from "@/shared/shadcn/components/ui/button";
import { MessageCircle } from "lucide-react";
import { Badge } from "@/shared/shadcn/components/ui/badge";
import { useState } from "react";
import { useChatStore } from "@/entities/potList/model/chatStore.ts";
import {stompClient} from "@/shared/utils/stompTest.ts";
import type {ChatMessage} from "@/entities/potList/types/chat.ts";

export default function ChatDrawer() {
    const [input, setInput] = useState("");

    const isSheetOpen = useChatStore((state) => state.isSheetOpen);
    const setSheetOpen = useChatStore((state) => state.setSheetOpen);
    const selectedRoom = useChatStore((state) => state.selectedRoom);
    const setSelectedRoom = useChatStore((state) => state.setSelectedRoom);

    const chatRooms = useChatStore((state) => state.chatRooms);
    const addMessage = useChatStore((state) => state.addMessage);

    const sendMessage = () => {
        if (!input.trim() || !selectedRoom) return;

        const msgId = Date.now();

        // 유저 메시지 저장
        addMessage(selectedRoom.id, {
            id: msgId,
            text: input,
            sender: "user",
        });

        setInput("");

        const body: ChatMessage = {
            id: null,
            chatRoomId: 1,
            senderUid: null,
            content: input,
            isRead: null,
            sentAt: null,
        }

        stompClient.publish({
            destination: "/chat.send",
            body: JSON.stringify(body)
        })

        // 봇 자동 응답
        setTimeout(() => {
            addMessage(selectedRoom.id, {
                id: msgId + 1,
                text: "확인했습니다!",
                sender: "bot",
            });
        }, 500);
    };

    return (
        <div>
            <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                    <div className="fixed bottom-23 right-6 md:bottom-27 md:right-8 z-50">
                        <Button className="cursor-pointer relative bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg w-14 h-14 md:w-16 md:h-16 transition-transform hover:scale-105">
                            <MessageCircle className="size-5 md:size-6" />
                            <Badge className="absolute top-0 right-0 w-5 h-5 md:w-6 md:h-6" variant="destructive">
                                3
                            </Badge>
                        </Button>
                    </div>
                </SheetTrigger>

                <SheetContent
                    side="right"
                    className="min-w-full md:min-w-1/3 flex flex-col z-150"
                    onCloseAutoFocus={() => setSelectedRoom(null)}
                >
                    <SheetHeader>
                        <SheetTitle>
                            {selectedRoom ? (
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => setSelectedRoom(null)}>
                                        ←
                                    </Button>
                                    {selectedRoom.name}
                                </div>
                            ) : (
                                "채팅방 목록"
                            )}
                        </SheetTitle>
                    </SheetHeader>

                    {/* 목록 */}
                    {!selectedRoom && (
                        <div className="flex-1 overflow-y-auto p-2 space-y-2">
                            {chatRooms.map((room) => (
                                <div
                                    key={room.id}
                                    className="flex flex-col p-3 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer"
                                    onClick={() => setSelectedRoom(room)}
                                >
                                    <p className="font-semibold">{room.name}</p>
                                    <p className="text-sm text-gray-500 truncate">{room.lastMessage}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 채팅방 */}
                    {selectedRoom && (() => {
                        const currentRoom = chatRooms.find((r) => r.id === selectedRoom.id)!;

                        return (
                            <div className="flex-1 flex flex-col">
                                <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50 dark:bg-gray-900 rounded-md">
                                    {currentRoom.messages.map((msg) => (
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
                                        className="flex-1 px-3 py-2 border rounded-md bg-white text-gray-900"
                                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                    />
                                    <Button
                                        onClick={sendMessage}
                                        className="bg-green-700 hover:bg-green-800 text-white h-full"
                                    >
                                        전송
                                    </Button>
                                </div>
                            </div>
                        );
                    })()}
                </SheetContent>
            </Sheet>
        </div>
    );
}
