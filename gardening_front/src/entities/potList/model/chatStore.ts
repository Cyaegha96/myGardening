import {create} from "zustand";
import type {ChatDTO, ChatRoomDTO, PotListDetailDTO} from "@/shared/api";
import {chatApi, chatRoomApi} from "@/entities/potList/api/chatApi.ts";
import {stompClient} from "@/shared/config/stompClient";
import type {StompSubscription} from "@stomp/stompjs";
import useUserStore from "@/app/store/userStore.ts";

type ChatRoomState = ChatRoomDTO & {
    messages: ChatDTO[];
};

type ChatStore = {
    chatModal: boolean;
    isSheetOpen: boolean;
    selectedRoom: ChatRoomState | null;
    chatRooms: ChatRoomState[];
    cursorId: string | undefined;
    hasMore: boolean;
    isFetching: boolean;

    lastChatUuid: string | undefined;

    totalUnreadChatCount: number;

    setLastChatUuid: (uuid: string | undefined) => void;

    setIsFetching: (flag: boolean) => void;

    subscriptions: StompSubscription[];

    addMessage: (roomId: number, message: ChatDTO, append?: boolean) => void;
    setChatRooms: (rooms: ChatRoomDTO[]) => void;

    initialChatRooms: (selectedPot: number | undefined) => void;
    addRoom: (potInfo: PotListDetailDTO) => void;

    toggleChatModal: () => void;
    setSheetOpen: (open: boolean) => void;
    setSelectedRoom: (room: ChatRoomState | null) => void;

    fetchMessages: () => Promise<void>;
};

const userUid = useUserStore.getState().uid;

export const useChatStore = create<ChatStore>((set, get) => ({
    chatModal: false,
    isSheetOpen: false,
    selectedRoom: null,
    chatRooms: [],
    cursorId: undefined,
    hasMore: true,
    isFetching: false,
    subscriptions: [],
    lastChatUuid: undefined,

    totalUnreadChatCount: 0,

    setLastChatUuid: (uuid) => set({lastChatUuid: uuid}),

    setIsFetching: (flag) => set({isFetching: flag}),

    setChatRooms: (rooms) =>
        set(() => ({
            chatRooms: rooms.map((r) => ({...r, messages: []})),
        })),

    addMessage: (roomId, message, append = false) => {
        set((state) => {
            let updatedSelectedRoom = state.selectedRoom;

            const updatedRooms = state.chatRooms.map((room) => {
                if (room.id !== roomId) return room;

                const isDuplicate = room.messages.some((m) => m.uuid === message.uuid);
                if (isDuplicate) return room;

                const newMessages = append ? [...room.messages, message] : [...room.messages, message];

                let lastChat = message;

                if (!append) {
                    newMessages.sort((a, b) => {
                        const aTime = a.sentAt ? new Date(a.sentAt).getTime() : 0;
                        const bTime = b.sentAt ? new Date(b.sentAt).getTime() : 0;
                        return aTime - bTime;
                    });
                }

                if (state.selectedRoom?.id === roomId) {
                    updatedSelectedRoom = {
                        ...state.selectedRoom,
                        messages: newMessages,
                    };
                    lastChat = newMessages[newMessages.length - 1];
                }

                return {
                    ...room,
                    messages: newMessages,
                    lastChat: lastChat.content,
                    lastMessageTime: message.sentAt || new Date().toISOString(),
                };
            });

            updatedRooms.sort((a, b) => {
                const aTime = a.lastMessageTime
                    ? new Date(a.lastMessageTime).getTime()
                    : new Date(a.createdAt!).getTime();
                const bTime = b.lastMessageTime
                    ? new Date(b.lastMessageTime).getTime()
                    : new Date(b.createdAt!).getTime();
                return bTime - aTime;
            });

            return {
                chatRooms: updatedRooms,
                selectedRoom: updatedSelectedRoom,
            };
        });
    },

    initialChatRooms: (selectedPot) => {
        set({cursorId: undefined, hasMore: true});
        chatRoomApi.getChatroomList().then((resp) => {
            const rooms = resp.data;
            rooms.sort((a, b) => {
                const aTime = a.lastMessageTime
                    ? new Date(a.lastMessageTime).getTime()
                    : new Date(a.createdAt!).getTime();
                const bTime = b.lastMessageTime
                    ? new Date(b.lastMessageTime).getTime()
                    : new Date(b.createdAt!).getTime();
                return bTime - aTime;
            });

            const totalUnreadCount = rooms
                .map(room => room.unreadChatCount)
                .reduce((sum, count) => sum! + count!, 0);

            set({totalUnreadChatCount: totalUnreadCount});

            get().setChatRooms(rooms);

            if (selectedPot) {
                const newRoom = rooms.map((r) => ({...r, messages: []})).find(
                    (room) => room.potListingId === selectedPot
                );
                if (newRoom) {
                    get().setSelectedRoom(newRoom);
                    get().setSheetOpen(true);
                }
            }

            set({subscriptions: []});

            rooms.forEach((room) => {
                try {
                    const sub = stompClient.subscribe(`/topic/chat/${room.id}`, (message) => {
                        const chat = JSON.parse(message.body) as ChatDTO;
                        if (chat.senderUid === userUid) return;

                        const targetRoom = get().chatRooms.find(r => r.id === room.id);
                        if (!targetRoom) return;

                        // 이미 messages에 동일 uuid가 있으면 return
                        if (targetRoom.messages.some(m => m.uuid === chat.uuid)) return;

                        set(prev => {
                            const updatedRooms = prev.chatRooms.map(r => {
                                if (r.id !== chat.chatRoomId) return r;

                                // 이미 메시지가 있으면 return
                                if (r.messages.some(m => m.uuid === chat.uuid)) return r;

                                return {
                                    ...r,
                                    messages: [...r.messages, chat],
                                    unreadChatCount: (r.unreadChatCount || 0) + 1
                                };
                            });

                            return {
                                chatRooms: updatedRooms,
                                totalUnreadChatCount: prev.totalUnreadChatCount + 1,
                                lastChatUuid: chat.uuid,
                            };
                        });

                        if (get().selectedRoom?.id === room.id) {
                            stompClient.publish({
                                destination: `/chat.ack`,
                                body: JSON.stringify(chat),
                            });
                            set(prev => {
                                const targetRoom = prev.chatRooms.find(r => r.id === room.id);
                                const unreadToClear = targetRoom?.unreadChatCount || 0;

                                const updatedRooms = prev.chatRooms.map(r => {
                                    if (r.id !== chat.chatRoomId) return r;

                                    return {
                                        ...r,
                                        unreadChatCount: 0,
                                    };
                                });

                                return {
                                    chatRooms: updatedRooms,
                                    totalUnreadChatCount: prev.totalUnreadChatCount - unreadToClear,
                                };
                            })
                        }
                    });

                    const ackSub = stompClient.subscribe(`/topic/chat/ack/${room.id}`, (message) => {
                        const chat = JSON.parse(message.body) as ChatDTO;

                        set((prev) => {
                            const updatedRooms = prev.chatRooms.map((room) => {
                                if (room.id !== chat.chatRoomId) return room;
                                const updatedMessages = room.messages.map((m) =>
                                    m.uuid === chat.uuid ? {...m, isRead: "Y"} : m
                                );

                                return {
                                    ...room,
                                    messages: updatedMessages
                                };
                            });

                            const updatedSelectedRoom =
                                prev.selectedRoom?.id === chat.chatRoomId
                                    ? {
                                        ...prev.selectedRoom,
                                        messages: prev.selectedRoom.messages.map((m) =>
                                            m.uuid === chat.uuid ? {...m, isRead: "Y"} : m
                                        ),
                                    }
                                    : prev.selectedRoom;

                            return {
                                chatRooms: updatedRooms,
                                selectedRoom: updatedSelectedRoom,
                            };
                        });
                    });

                    set((prev) => ({subscriptions: [...prev.subscriptions, sub, ackSub]}));
                } catch (err) {
                    console.warn(`Already subscribed to chat room ${room.id}`);
                }
            });
        });
    },

    addRoom: (potInfo) => {
        chatRoomApi.insertChatRoom(potInfo).then(() => {
            get().initialChatRooms(potInfo.id);
        });
    },

    toggleChatModal: () => set((state) => ({chatModal: !state.chatModal})),
    setSheetOpen: (open) => set(() => ({isSheetOpen: open})),
    setSelectedRoom: (room) => {
        if (!room) {
            set({
                selectedRoom: null,
                hasMore: true,
                cursorId: undefined,
                lastChatUuid: undefined
            });
            return;
        }

        // 읽지 않은 메시지 확인
        const unreadMessages = room?.messages.filter(msg => msg.senderUid !== userUid && msg.isRead === "N");

        unreadMessages?.forEach(msg => {
            stompClient.publish({
                destination: `/chat.ack`,
                body: JSON.stringify(msg),
            });
        });

        set((prev) => ({
            selectedRoom: {
                ...room,
                unreadChatCount: 0, // 선택 시 모든 읽지 않은 메시지 처리
            },
            hasMore: true,
            cursorId: undefined,
            lastChatUuid: room.messages.length > 0
                ? room.messages[room.messages.length - 1].uuid // 마지막 메시지로 스크롤 가능
                : undefined,
            totalUnreadChatCount: prev.totalUnreadChatCount - unreadMessages.length,
        }));
    },

    fetchMessages: async () => {
        const state = get();
        const roomId = state.selectedRoom?.id;
        if (!roomId) return;

        state.setIsFetching(true);

        await chatApi.getChatHistoryByRoomId(roomId, state.cursorId)
            .then((resp) => {
                const data = resp.data;
                if (data.length === 0) {
                    set({cursorId: undefined, hasMore: false});
                    return;
                }

                if (!state.lastChatUuid) {
                    set({lastChatUuid: data[0].uuid});
                }

                data.forEach((item) => {
                    state.addMessage(roomId, item, false);
                });

                console.log(get().lastChatUuid, data);

                const oldestSentAt = data.reduce((prev, curr) =>
                    new Date(prev.sentAt!).getTime() < new Date(curr.sentAt!).getTime() ? prev : curr
                ).sentAt;

                set({cursorId: new Date(oldestSentAt!).toISOString()});
            })
            .finally(() => state.setIsFetching(false));
    },
}));
