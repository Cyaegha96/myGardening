import type {ChatbotState} from "@/entities/chatbot/model/ChatbotState.ts";
import {create} from "zustand";

const useChatbotStore = create<ChatbotState>((set) => ({
    sessionId: null,
    messages: [],
    isLoading: false,

    setSessionId: (id: number) => set({ sessionId: id }),
    addMessage: (msg) => set((state) => ({
        messages: [...state.messages, msg]
    })),
    setMessages: (msgs) => set({ messages: msgs }),
    clear: () => set({ sessionId: null, messages: [] }),

    // 로딩 상태 변경 함수
    setIsLoading: (v: boolean) => set({ isLoading: v }),

    resetMessages: () => set({ messages: [] }),
}));

export default useChatbotStore;
