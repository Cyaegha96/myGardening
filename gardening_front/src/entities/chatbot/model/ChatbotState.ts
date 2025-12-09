export interface ChatbotState {
    sessionId: number | null;
    messages: { sender: "user" | "bot"; content: string }[];

    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;

    setSessionId: (id: number | null) => void;
    addMessage: (msg: { sender: "user" | "bot"; content: string }) => void;
    setMessages: (msgs: { sender: "user" | "bot"; content: string }[]) => void;
    clear: () => void;
}