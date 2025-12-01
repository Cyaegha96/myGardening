export type ChatMessage = {
    id: number;
    text: string;
    sender: "user" | "bot";
};

export type ChatRoom = {
    id: number;
    name: string;
    lastMessage: string;
    messages: ChatMessage[];
};