import { create } from "zustand";

type ChatMessage = {
    id: number;
    text: string;
    sender: "user" | "bot";
};

type ChatRoom = {
    id: number;
    name: string;
    lastMessage: string;
    messages: ChatMessage[];
};

type PotListStore = {
    chatModal: boolean;
    chatRooms: ChatRoom[];

    // actions (원하면 추가 가능)
    toggleChatModal: () => void;
};

export const usePotListStore = create<PotListStore>((set) => ({
    chatModal: false,

    chatRooms: [
        {
            id: 1,
            name: "식물 상담방 1",
            lastMessage: "보통 하루 한 번 아침에 주세요.",
            messages: [
                { id: 1, text: "안녕하세요!", sender: "bot" },
                { id: 2, text: "물 주기는 어떻게 하나요?", sender: "user" },
                { id: 3, text: "보통 하루 한 번 아침에 주세요.", sender: "bot" },
            ],
        },
        {
            id: 2,
            name: "식물 상담방 2",
            lastMessage: "알겠습니다!",
            messages: [
                { id: 1, text: "식물 종류가 뭐예요?", sender: "user" },
                { id: 2, text: "몬스테라입니다.", sender: "bot" },
                { id: 3, text: "알겠습니다!", sender: "bot" },
            ],
        },
    ],

    // 모달 열고 닫기
    toggleChatModal: () =>
        set((state) => ({
            chatModal: !state.chatModal,
        })),
}));
