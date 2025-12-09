import {
    ChatbotControllerApi,
    type ChatbotRequestDTO
} from "@/shared/api";
import useChatbotStore from "@/features/chatbot/model/chatbotStore.ts";

const api = new ChatbotControllerApi();

export const useSendMessage = () => {
    const sessionId = useChatbotStore(s => s.sessionId);
    const setSessionId = useChatbotStore(s => s.setSessionId);
    const addMessage = useChatbotStore(s => s.addMessage);

    const startSessionIfNeeded = async () => {
        if (sessionId !== null) return sessionId;

        const res = await api.startSession();
        if (!res.data?.sessionId) return null;

        setSessionId(res.data.sessionId);
        if (res.data?.content) {
            addMessage({
                sender: "bot",
                content: res.data.content
            });
        }

        return res.data.sessionId;
    };

    const send = async (text: string) => {
        const sid = await startSessionIfNeeded();
        if (!sid) return;

        const dto: ChatbotRequestDTO = { content: text };

        // UI 즉시 추가
        addMessage({ sender: "user", content: text });

        // 응답 로딩 시작
        useChatbotStore.getState().setIsLoading(true);

        const res = await api.sendMessage(sid, dto, undefined);

        // 응답 로딩 종료
        useChatbotStore.getState().setIsLoading(false);

        if (res.data?.content) {
            addMessage({
                sender: "bot",
                content: res.data.content
            });
        }
    };

    return { send, startSessionIfNeeded };
};
