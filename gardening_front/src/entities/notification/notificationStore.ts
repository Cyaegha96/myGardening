import {create} from "zustand";
import type {NotificationDTO} from "@/shared/api";
import type {StompSubscription} from "@stomp/stompjs";
import {stompClient} from "@/shared/config/stompClient.ts";
import useUserStore from "@/app/store/userStore.ts";
import {notificationApi} from "@/entities/notification/notificationApi.ts";

type NotificationStore = {
    notificationLists: NotificationDTO[];
    notificationSub: StompSubscription | undefined;

    totalNotificationCount: number;

    initialize: () => void;
};

export const useNotificationStore = create<NotificationStore>((set, get) => ({
    notificationLists: [],

    notificationSub: undefined,

    totalNotificationCount: 0,

    initialize: async () => {
        const sub = stompClient.subscribe(`/topic/notification/` + useUserStore.getState().uid, (message) => {
            const newNotification = JSON.parse(message.body) as NotificationDTO;
            set(prev => ({notificationLists: [...prev.notificationLists, newNotification], totalNotificationCount: prev.totalNotificationCount + 1}));
        })
        const resp = await notificationApi.getUserNotificationList(useUserStore.getState().uid);
        set({notificationLists: resp.data, notificationSub: sub, totalNotificationCount: resp.data.length});
    },
}))