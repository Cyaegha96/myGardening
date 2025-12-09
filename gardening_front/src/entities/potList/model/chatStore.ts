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

                const isDuplicate = room.messages.some((m) => m.id === message.id);
                if (isDuplicate) return room;

                const newMessages = append ? [message, ...room.messages] : [...room.messages, message];

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
                }

                return {
                    ...room,
                    messages: newMessages,
                    lastChat: message.content,
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

            const state = get();
            state.setChatRooms(rooms);

            if (selectedPot) {
                const newRoom = rooms.map((r) => ({...r, messages: []})).find(
                    (room) => room.potListingId === selectedPot
                );
                if (newRoom) {
                    state.setSelectedRoom(newRoom);
                    state.setSheetOpen(true);
                }
            }

            set({subscriptions: []});

            rooms.forEach((room) => {
                try {
                    const sub = stompClient.subscribe(`/topic/chat/${room.id}`, (message) => {
                        const chat = JSON.parse(message.body) as ChatDTO;
                        if (chat.senderUid === userUid) return;

                        chat.isRead = "Y";
                        state.addMessage(room.id!, chat, true);
                        stompClient.publish({
                            destination: `/chat.ack`,
                            body: JSON.stringify(chat),
                        });
                    });

                    const ackSub = stompClient.subscribe(`/topic/chat/ack/${room.id}`, (message) => {
                        const chat = JSON.parse(message.body) as ChatDTO;

                        set((prev) => {
                            const updatedRooms = prev.chatRooms.map((room) => {
                                if (room.id !== chat.chatRoomId) return room;
                                const updatedMessages = room.messages.map((m) =>
                                    m.uuid === chat.uuid ? {...m, isRead: "Y"} : m
                                );
                                return {...room, messages: updatedMessages};
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
    setSelectedRoom: (room) => set(() => ({selectedRoom: room, hasMore: true, cursorId: undefined})),

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

                data.forEach((item) => {
                    state.addMessage(roomId, item, true);
                });

                const oldestSentAt = data.reduce((prev, curr) =>
                    new Date(prev.sentAt!).getTime() < new Date(curr.sentAt!).getTime() ? prev : curr
                ).sentAt;

                set({cursorId: new Date(oldestSentAt!).toISOString()});
            })
            .finally(() => state.setIsFetching(false));
    },
}));
