export type ChatbotMessage = {
    sender: "user" | "bot";
    content?: string;
    url?: string;
};

export interface ChatbotState {
    sessionId: number | null;
    messages: ChatbotMessage[];
    isLoading: boolean;

    // 세션ID 관리
    setSessionId: (id: number | null) => void;

    // 메시지 관리
    addMessage: (msg: ChatbotMessage) => void;
    resetMessages: () => void;

    // 전체 초기화 (로그아웃 등에 사용)
    resetSession: () => void;

    // 기존 메시지 대체 (필요 시)
    setMessages: (msgs: ChatbotMessage[]) => void;

    // 로딩 표시
    setIsLoading: (v: boolean) => void;
}
