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
    selectRoomById: (roomId: number) => void;
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

    selectRoomById: async (roomId: number) => {
        await get().initialChatRooms();

        const target = get().chatRooms.find(r => r.id === roomId);
        console.log(target);
        if (!target) return;

        get().setSelectedRoom(target);

        set({isSheetOpen: true});
    },

    initialChatRooms: async (selectedPot) => {
        set({cursorId: undefined, hasMore: true});
        await chatRoomApi.getChatroomList().then((resp) => {
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
                                    unreadChatCount: (r.unreadChatCount || 0) + 1,
                                    lastChat: chat.content,
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

        const userUid = useUserStore.getState().uid;

        // 현재 chatRooms에서 해당 방 가져오기
        const existing = get().chatRooms.find(r => r.id === room.id);

        // 메시지를 비우기
        const resetRoom = {
            ...existing,
            messages: [],
            unreadChatCount: 0,
        };

        // 읽지 않은 메시지 처리
        const unreadMessages = existing?.messages.filter(
            msg => msg.senderUid !== userUid && msg.isRead === "N"
        ) ?? [];

        unreadMessages.forEach(msg => {
            stompClient.publish({
                destination: `/chat.ack`,
                body: JSON.stringify(msg),
            });
        });

        // chatRooms 배열에서 해당 방만 교체
        set(prev => ({
            chatRooms: prev.chatRooms.map(r =>
                r.id === room.id ? resetRoom : r
            ),
            selectedRoom: resetRoom,
            hasMore: true,
            cursorId: undefined,
            lastChatUuid: undefined,
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

                const oldestSentAt = data.reduce((prev, curr) =>
                    new Date(prev.sentAt!).getTime() < new Date(curr.sentAt!).getTime() ? prev : curr
                ).sentAt;

                set({cursorId: new Date(oldestSentAt!).toISOString()});
            })
            .finally(() => state.setIsFetching(false));
    },
}));
