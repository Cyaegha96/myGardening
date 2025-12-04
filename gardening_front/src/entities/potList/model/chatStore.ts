import {create} from "zustand";
import type {ChatRoom} from "@/entities/potList/types/chat.ts";

type ChatStore = {
    chatModal: boolean;
    isSheetOpen: boolean;
    selectedRoom: ChatRoom | null;
    chatRooms: ChatRoom[];

    // actions (원하면 추가 가능)
    addMessage: (roomId, message) => void;
    toggleChatModal: () => void;

    setSheetOpen: (open: boolean) => void;
    setSelectedRoom: (room: ChatRoom | null) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
    chatModal: false,

    isSheetOpen: false,

    selectedRoom: null,

    chatRooms: [
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
    ],

    addMessage: (roomId, message) =>
        set((state) => ({
            chatRooms: state.chatRooms.map((room) =>
                room.id === roomId
                    ? {
                        ...room,
                        messages: [...room.messages, message],
                        lastMessage: message.text,
                    }
                    : room
            ),
        })),

    toggleChatModal: () =>
        set((state) => ({
            chatModal: !state.chatModal,
        })),

    setSheetOpen: (open) =>
        set(() => ({
            isSheetOpen: open,
        })),

    setSelectedRoom: (room) =>
        set(() => ({
            selectedRoom: room,
        })),
}));
