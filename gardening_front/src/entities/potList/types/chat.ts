export type ChatMessage = {
    id: number | null,
    chatRoomId: number,
    senderUid: number | null,
    content: string,
    isRead: string | null,
    sentAt: string | null,
};

export type ChatRoom = {
    id: number;
    name: string;
    lastMessage: string;
    messages: ChatMessage[];
};