import {
    ChatbotControllerApi,
    type ChatbotRequestDTO,
    type ChatbotResponseDTO
} from "@/shared/api";
import useChatbotStore from "@/features/chatbot/model/chatbotStore.ts";

const api = new ChatbotControllerApi();

export const useSendMessage = () => {
    const sessionId = useChatbotStore(s => s.sessionId);
    const setSessionId = useChatbotStore(s => s.setSessionId);
    const addMessage = useChatbotStore(s => s.addMessage);
    const resetMessages = useChatbotStore(s => s.resetMessages);

    const startSessionIfNeeded = async () => {
        if (sessionId !== null) return sessionId;

        const res = await api.startSession();
        const data = res.data;
        if (!data?.sessionId) return null;

        setSessionId(data.sessionId);
        resetMessages();    // 신규 시작 UI 초기화

        if (data.content) {
            addMessage({ sender: "bot", content: data.content });
        }
        return data.sessionId;
    };

    const send = async (text: string, file?: File) => {
        const sid = await startSessionIfNeeded();
        if (!sid) return;

        const dto: ChatbotRequestDTO = { content: text };

        // 사용자 메시지 즉시 UI 반영
        addMessage({
            sender: "user",
            content: text || undefined,
            url: file ? URL.createObjectURL(file) : undefined
        });

        const store = useChatbotStore.getState();
        store.setIsLoading(true);

        let res;
        try {
            res = await api.sendMessage(sid, dto, file);
        } catch (e) {
            store.setIsLoading(false);
            return;
        }
        store.setIsLoading(false);

        const data: ChatbotResponseDTO | undefined = res.data;
        if (!data) return;

        // 💡 sessionId가 바뀌면 = 새로운 상담 시작!
        if (data.sessionId && data.sessionId !== sessionId) {
            setSessionId(data.sessionId);
            resetMessages();

            // 새로운 상담 첫 메시지로 봇 답변만 표시
            if (data.content || data.url) {
                addMessage({
                    sender: "bot",
                    content: data.content || undefined,
                    url: data.url || undefined
                });
            }
            return;
        }

        // 기존 상담이면 그대로 메시지 append
        addMessage({
            sender: "bot",
            content: data.content || undefined,
            url: data.url || undefined
        });
    };

    return { send, startSessionIfNeeded };
};
