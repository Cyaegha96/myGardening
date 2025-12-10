import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/shared/shadcn/components/ui/sheet";
import {Button} from "@/shared/shadcn/components/ui/button";
import {MessageCircle} from "lucide-react";
import {Badge} from "@/shared/shadcn/components/ui/badge";
import {useEffect, useRef, useState} from "react";
import {useChatStore} from "@/entities/potList/model/chatStore";
import {stompClient} from "@/shared/config/stompClient";
import type {ChatDTO} from "@/shared/api";
import useUserStore from "@/app/store/userStore.ts";
import {v4 as uuid4} from "uuid";
import {formatPrice} from "@/entities/potList/libs/formatPrice.ts";
import {getRelativeTime} from "@/shared/libs/getRelativeTime.ts";
import {useNavigate} from "react-router-dom";

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
    const lastChatUuid = useChatStore(state => state.lastChatUuid);
    const setLastChatUuid = useChatStore(state => state.setLastChatUuid);

    const totalUnreadChatCount = useChatStore(state => state.totalUnreadChatCount);

    const userUid = useUserStore((state) => state.uid);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        requestAnimationFrame(() => {
            messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
            setLastChatUuid(undefined);
        });
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
            sentAt: Date.now(),
        };

        setLastChatUuid(newMessage.uuid); // append 메시지
        addMessage(selectedRoom.id!, newMessage, true);

        stompClient.publish({
            destination: "/chat.send",
            body: JSON.stringify(newMessage),
        });

        setInput("");
        scrollToBottom();
    };

    const navigate = useNavigate();

    // 초기 채팅방 로드 및 구독
    useEffect(() => {
        initialChatRooms(undefined);

        return () => {
            useChatStore.getState().subscriptions.forEach((sub) => sub.unsubscribe());
        };
    }, []);

    // 메시지 변경 시 스크롤 처리
    useEffect(() => {
        if (lastChatUuid && lastChatUuid === selectedRoom?.messages[selectedRoom?.messages.length - 1].uuid) {
            scrollToBottom();
        } else if (lastChatUuid && hasMore) {
            const scrollContainer = scrollRef.current;
            if (!scrollContainer) return;

            const prevScrollHeight = scrollContainer.scrollHeight;
            const prevScrollTop = scrollContainer.scrollTop;

            const adjustScroll = () => {
                const newScrollHeight = scrollContainer.scrollHeight;
                scrollContainer.scrollTop = prevScrollTop + (newScrollHeight - prevScrollHeight);
            };

            requestAnimationFrame(() => {
                adjustScroll();
                requestAnimationFrame(adjustScroll); // 두 번째 보정
            });
        }
    }, [selectedRoom?.messages]);

    const handleFetch = () => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        let ticking = false; // requestAnimationFrame 중복 방지

        if (!hasMore || isFetching) return;

        if (!ticking) {
            ticking = true;
            requestAnimationFrame(() => {
                if (scrollContainer.scrollTop < 50) {
                    setIsFetching(true);
                    const prevScrollHeight = scrollContainer.scrollHeight;

                    fetchMessages().finally(() => {
                        const newScrollHeight = scrollContainer.scrollHeight;
                        const scrollDiff = newScrollHeight - prevScrollHeight;

                        // 부드럽게 이동 (animate)
                        scrollContainer.scrollBy({top: scrollDiff, behavior: "smooth"});

                        setIsFetching(false);
                        ticking = false;
                    });
                } else {
                    ticking = false;
                }
            });
        }
    }

    // 스크롤 이벤트 기반 과거 메시지 로드
    // useEffect(() => {
    //     const scrollContainer = scrollRef.current;
    //     if (!scrollContainer) return;
    //
    //     let ticking = false; // requestAnimationFrame 중복 방지
    //
    //     const handleScroll = () => {
    //         if (!hasMore || isFetching) return;
    //
    //         if (!ticking) {
    //             ticking = true;
    //             requestAnimationFrame(() => {
    //                 if (scrollContainer.scrollTop < 50) {
    //                     setIsFetching(true);
    //                     const prevScrollHeight = scrollContainer.scrollHeight;
    //
    //                     fetchMessages().finally(() => {
    //                         const newScrollHeight = scrollContainer.scrollHeight;
    //                         const scrollDiff = newScrollHeight - prevScrollHeight;
    //
    //                         // 부드럽게 이동 (animate)
    //                         scrollContainer.scrollBy({top: scrollDiff, behavior: "smooth"});
    //
    //                         setIsFetching(false);
    //                         ticking = false;
    //                     });
    //                 } else {
    //                     ticking = false;
    //                 }
    //             });
    //         }
    //     };
    //
    //     scrollContainer.addEventListener("scroll", handleScroll);
    //     return () => scrollContainer.removeEventListener("scroll", handleScroll);
    // }, [selectedRoom, hasMore, isFetching]);

    // 선택된 채팅방 메시지가 10개 미만일 경우 초기 fetch
    useEffect(() => {
        if (selectedRoom) {
            const room = chatRooms.find((r) => r.id === selectedRoom.id);
            if (room && room.messages.length < 10 && hasMore) {
                fetchMessages();
            }
        }
    }, [selectedRoom]);

    return (
        <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
                <div className="fixed bottom-23 right-6 md:bottom-27 md:right-8 z-50">
                    <Button
                        className="cursor-pointer relative bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg w-14 h-14 md:w-16 md:h-16 transition-transform hover:scale-105">
                        <MessageCircle className="size-5 md:size-6"/>
                        {totalUnreadChatCount > 0 &&
                            <Badge className="absolute top-0 right-0 w-5 h-5 md:w-6 md:h-6" variant="destructive">
                                {totalUnreadChatCount}
                            </Badge>
                        }
                    </Button>
                </div>
            </SheetTrigger>

            <SheetContent
                side="right"
                className="min-w-full md:min-w-1/4 flex flex-col"
                onCloseAutoFocus={() => setSelectedRoom(null)}
            >
                <SheetHeader>
                    <SheetTitle>
                        {selectedRoom ? (
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => setSelectedRoom(null)}>
                                        ←
                                    </Button>
                                    <span>{selectedRoom?.potInfo?.title}</span>
                                </div>

                                <Button
                                    variant="outline"
                                    className="me-7"
                                    size="sm"
                                    onClick={() => {
                                        if (selectedRoom?.potListingId) {
                                            navigate(`/pot-list/${selectedRoom.potListingId}`);
                                            setSheetOpen(false);
                                        }
                                    }}
                                >
                                    글 보러 가기
                                </Button>
                            </div>
                        ) : (
                            "채팅방 목록"
                        )}
                    </SheetTitle>
                </SheetHeader>

                {!selectedRoom && (
                    <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-0">
                        <div className="overflow-auto">
                            {chatRooms.length === 0 && (
                                <p className="text-sm text-gray-500 ms-5">채팅방이 없습니다.</p>
                            )}

                            {chatRooms.map((item, idx) => (item.potInfo &&
                                <div
                                    key={idx}
                                    className={`relative flex items-center gap-3 p-2 rounded-lg 
                                            bg-green-50 dark:bg-green-900 hover:bg-green-100 dark:hover:bg-green-800 
                                            cursor-pointer transition m-1 truncate`}
                                    onClick={() => setSelectedRoom(item)}
                                >
                                    {item.potInfo.thumbnail ? (
                                        <img
                                            src={item.potInfo.thumbnail}
                                            alt="썸네일"
                                            className="min-w-16 h-16 object-cover rounded-md"
                                        />
                                    ) : (
                                        <div
                                            className="min-w-16 h-16 rounded-md bg-secondary flex items-center justify-center text-center text-secondary-foreground text-xs">
                                            등록된<br/>
                                            사진 없음
                                        </div>
                                    )}

                                    <div className="flex flex-col min-w-0">
                                        <div className="flex items-center gap-2 pe-20 min-w-0">
                                            <p className="font-semibold truncate flex-1 min-w-0">{item.potInfo.title}</p>
                                            {/* 판매 상태 배지 */}
                                            {item.potInfo.status && item.potInfo.status !== "BEFORE_TRADE" && (
                                                <>
                                                    {item.potInfo.status === "PENDING_TRADE" && (
                                                        <span
                                                            className="mb-1 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded-full shadow-sm flex-shrink-0">
                                                                    예약중
                                                                </span>
                                                    )}
                                                    {item.potInfo.status === "AFTER_TRADE" && (
                                                        <span
                                                            className="px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded-full shadow-sm flex-shrink-0">
                                                                    거래완료
                                                                </span>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                        <div className="max-w-[50%]">
                                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                                {item.lastChat}
                                            </p>
                                        </div>
                                    </div>

                                    {item.lastChat && (
                                        <p className="absolute bottom-3 right-5 text-xs text-primary overflow-hidden whitespace-nowrap overflow-ellipsis max-w-[30%]">
                                            {item.potInfo.type === "SELL" ? (item.potInfo.price && item.potInfo.price! > 0 ? `${formatPrice(item.potInfo.price)}원` : "무료 나눔") : "삽니다"}
                                        </p>
                                    )}

                                    {(item.unreadChatCount || 0) > 0 && (
                                        <Badge
                                            variant="destructive"
                                            className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center text-xs"
                                        >
                                            {item.unreadChatCount}
                                        </Badge>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {selectedRoom && (() => {
                    const currentRoom = chatRooms.find((r) => r.id === selectedRoom.id);
                    if (!currentRoom) return null;

                    return (
                        <div className="flex-1 flex flex-col h-1">
                            <div ref={scrollRef}
                                 className={`flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50 rounded-md`}>
                                {currentRoom.messages.map((msg, idx) => {
                                    const isMe = msg.senderUid === userUid;
                                    const isRead = msg.isRead === "Y";

                                    const prevMsg = currentRoom.messages[idx - 1];
                                    const msgDate = new Date(msg.sentAt!);
                                    const prevMsgDate = prevMsg ? new Date(prevMsg.sentAt!) : null;

                                    // 이전 메시지와 날짜가 다르면 separator 렌더링
                                    const showDateSeparator =
                                        !prevMsgDate ||
                                        msgDate.toDateString() !== prevMsgDate.toDateString();

                                    return (
                                        <div>
                                            {showDateSeparator && hasMore && (
                                                <div className="flex justify-center my-2">
                                                    <span
                                                        className="text-xs text-gray-500 bg-gray-200 cursor-pointer hover:bg-gray-400 px-2 py-1 rounded"
                                                        onClick={handleFetch}
                                                    >
                                                        더 보기
                                                    </span>
                                                </div>
                                            )}
                                            {showDateSeparator && (
                                                <div className="flex justify-center my-2">
                                                    <span
                                                        className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                                                        {msgDate.toLocaleDateString()} {/* 원하는 포맷으로 변경 가능 */}
                                                    </span>
                                                </div>
                                            )}
                                            <div key={msg.id}
                                                 className={`flex items-start ${isMe ? "justify-end" : "justify-start"} gap-1`}>


                                                {/* 읽지 않음 표시 (왼쪽, 말풍선 바깥) */}
                                                {isMe &&
                                                    <div
                                                        className={`flex flex-col ${!isRead ? "justify-end self-start" : "justify-start self-end mb-1"} items-end mt-1`}>
                                                        {!isRead && (
                                                            <span className="text-xs text-accent">
                                                        읽지 않음
                                                    </span>
                                                        )}
                                                        <span className="text-xs text-primary">
                                                    {getRelativeTime(msg.sentAt!)}
                                                </span>
                                                    </div>
                                                }

                                                <div
                                                    className={`max-w-[70%] px-4 py-2 rounded-lg ${
                                                        isMe ? "bg-green-700 text-white" : "bg-gray-200 text-gray-900"
                                                    }`}
                                                >
                                                    {msg.content}
                                                </div>

                                                {!isMe &&
                                                    <div
                                                        className={`flex flex-col ${!isRead ? "justify-end self-start" : "justify-start self-end mb-1"} items-end mt-1`}>
                                                    <span className="text-xs text-primary">
                                                        {getRelativeTime(msg.sentAt!)}
                                                    </span>
                                                    </div>
                                                }
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
                                    placeholder={selectedRoom.potInfo.status === "AFTER_TRADE" ? "거래 완료된 글입니다." : "메시지를 입력하세요..."}
                                    className="flex-1 px-3 py-2 border rounded-md bg-white"
                                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                    disabled={selectedRoom.potInfo.status === "AFTER_TRADE"}
                                />
                                <Button
                                    onClick={() => {
                                        if (selectedRoom.potInfo.status !== "AFTER_TRADE") sendMessage();
                                    }}
                                    className={`${selectedRoom.potInfo.status === "AFTER_TRADE" ? "cursor-not-allowed hover:bg-green-700/30 bg-green-700/30" : "hover:bg-green-800 bg-green-700"} text-white`}
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
