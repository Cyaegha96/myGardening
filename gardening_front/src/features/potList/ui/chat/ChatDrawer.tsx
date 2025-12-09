import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/shared/shadcn/components/ui/sheet";
import { Button } from "@/shared/shadcn/components/ui/button";
import { MessageCircle } from "lucide-react";
import { Badge } from "@/shared/shadcn/components/ui/badge";
import { useEffect, useRef, useState } from "react";
import { useChatStore } from "@/entities/potList/model/chatStore";
import { stompClient } from "@/shared/config/stompClient";
import type { ChatDTO } from "@/shared/api";
import useUserStore from "@/app/store/userStore.ts";
import { v4 as uuid4 } from "uuid";

export default function ChatDrawer() {
    const [input, setInput] = useState("");

    const isSheetOpen = useChatStore((state) => state.isSheetOpen);
    const setSheetOpen = useChatStore((state) => state.setSheetOpen);
    const selectedRoom = useChatStore((state) => state.selectedRoom);
    const setSelectedRoom = useChatStore((state) => state.setSelectedRoom);

    const chatRooms = useChatStore((state) => state.chatRooms);
    const addMessage = useChatStore((state) => state.addMessage);
    const initialChatRooms = useChatStore((state) => state.initialChatRooms);

    const fetchMessages = useChatStore((state) => state.fetchMessages);
    const hasMore = useChatStore((state) => state.hasMore);
    const isFetching = useChatStore((state) => state.isFetching);
    const setIsFetching = useChatStore((state) => state.setIsFetching);

    const userUid = useUserStore((state) => state.uid);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const prevMessageLengthRef = useRef<number>(0);
    const lastActionRef = useRef<"append" | "prepend" | null>(null);

    const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
        messagesEndRef.current?.scrollIntoView({ behavior });
    };

    const sendMessage = () => {
        if (!input.trim() || !selectedRoom) return;

        const tempId: number = -Date.now() * 1000 + Math.floor(Math.random() * 1000);

        const newMessage: ChatDTO = {
            id: tempId,
            senderUid: userUid!,
            chatRoomId: selectedRoom.id!,
            content: input,
            isRead: "N",
            uuid: uuid4(),
        };

        lastActionRef.current = "append"; // append 메시지
        addMessage(selectedRoom.id!, newMessage, true);

        stompClient.publish({
            destination: "/chat.send",
            body: JSON.stringify(newMessage),
        });

        setInput("");
        scrollToBottom();
    };

    // 초기 채팅방 로드 및 구독
    useEffect(() => {
        initialChatRooms(undefined);

        return () => {
            useChatStore.getState().subscriptions.forEach((sub) => sub.unsubscribe());
        };
    }, []);

    // 메시지 변경 시 스크롤 처리
    useEffect(() => {
        const currentLength = selectedRoom?.messages?.length || 0;
        const scrollContainer = scrollRef.current;

        if (lastActionRef.current === "append") {
            scrollToBottom();
        } else if (lastActionRef.current === "prepend" && scrollContainer) {
            const prevHeight = scrollContainer.scrollHeight;
            setTimeout(() => {
                scrollContainer.scrollTop = scrollContainer.scrollHeight - prevHeight;
            }, 0);
        }

        prevMessageLengthRef.current = currentLength;
        lastActionRef.current = null;
    }, [selectedRoom?.messages]);

    // 스크롤 이벤트 기반 과거 메시지 로드
    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        const handleScroll = () => {
            if (!hasMore || isFetching) return;

            if (scrollContainer.scrollTop < 50) {
                setIsFetching(true);
                const prevScrollHeight = scrollContainer.scrollHeight;

                lastActionRef.current = "prepend";
                fetchMessages().finally(() => {
                    setTimeout(() => {
                        scrollContainer.scrollTop = scrollContainer.scrollHeight - prevScrollHeight;
                        setIsFetching(false);
                    }, 0);
                });
            }
        };

        scrollContainer.addEventListener("scroll", handleScroll);
        return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }, [selectedRoom, hasMore, isFetching]);

    // 선택된 채팅방 메시지가 10개 미만일 경우 초기 fetch
    useEffect(() => {
        if (selectedRoom) {
            const room = chatRooms.find((r) => r.id === selectedRoom.id);
            if (room && room.messages.length < 10 && hasMore) {
                lastActionRef.current = "append";
                fetchMessages();
                scrollToBottom();
            }
        }
    }, [selectedRoom]);

    return (
        <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
                <div className="fixed bottom-23 right-6 md:bottom-27 md:right-8 z-50">
                    <Button
                        className="cursor-pointer relative bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg w-14 h-14 md:w-16 md:h-16 transition-transform hover:scale-105">
                        <MessageCircle className="size-5 md:size-6" />
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
                                <Button variant="ghost" size="sm" onClick={() => setSelectedRoom(null)}>
                                    ←
                                </Button>
                                채팅방 #{selectedRoom.potListingId}
                            </div>
                        ) : (
                            "채팅방 목록"
                        )}
                    </SheetTitle>
                </SheetHeader>

                {!selectedRoom && (
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {chatRooms.map((room) => (
                            <div
                                key={room.id}
                                className="flex flex-col p-3 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer"
                                onClick={() => setSelectedRoom(room)}
                            >
                                <p className="font-semibold">채팅방 #{room.potListingId}</p>
                                <p className="text-sm text-gray-500 truncate">
                                    {room.lastChat || "메시지가 없습니다."}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {selectedRoom && (() => {
                    const currentRoom = chatRooms.find((r) => r.id === selectedRoom.id);
                    if (!currentRoom) return null;

                    return (
                        <div className="flex-1 flex flex-col h-1">
                            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50 rounded-md">
                                {currentRoom.messages.map((msg) => {
                                    const isMe = msg.senderUid === userUid;
                                    const isRead = msg.isRead === "Y";

                                    return (
                                        <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                            <div
                                                className={`max-w-[70%] px-4 py-2 rounded-lg ${
                                                    isMe ? "bg-green-700 text-white" : "bg-gray-200 text-gray-900"
                                                }`}
                                            >
                                                {msg.content}
                                                {isMe && !isRead && (
                                                    <span className="text-xs text-blue-500 ml-1">(읽지 않음)</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef}></div>
                            </div>

                            <div className="mt-2 p-2 flex gap-2 border-t">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="메시지를 입력하세요..."
                                    className="flex-1 px-3 py-2 border rounded-md bg-white"
                                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                />
                                <Button
                                    onClick={sendMessage}
                                    className="bg-green-700 hover:bg-green-800 text-white"
                                >
                                    전송
                                </Button>
                            </div>
                        </div>
                    );
                })()}
            </SheetContent>
        </Sheet>
    );
}
