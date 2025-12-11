import {motion, MotionConfig} from "framer-motion";
import {Button} from "@/shared/shadcn/components/ui/button.tsx";
import {Bell, X} from "lucide-react";
import * as React from "react";
import {useEffect, useRef} from "react";
import {useNotificationStore} from "@/entities/notification/notificationStore.ts";
import {Badge} from "@/shared/shadcn/components/ui/badge.tsx";
import type {NotificationDTO} from "@/shared/api";
import {notificationApi} from "@/entities/notification/notificationApi.ts";
import {useNavigate} from "react-router-dom";
import {useChatStore} from "@/entities/potList/model/chatStore.ts";

const transition = {
    type: "spring",
    bounce: 0,
    duration: 0.3,
}

export default function NotificationFloatingBox() {
    const [isOpen, setIsOpen] = React.useState(false);
    const notificationList = useNotificationStore(state => state.notificationLists);
    const totalNotificationCount = useNotificationStore(state => state.totalNotificationCount);

    const notificationRef = useRef<HTMLDivElement | null>(null);

    const navigate = useNavigate();

    const handleOnClickNotification = (notification: NotificationDTO) => {
        if (notification) {
            notificationApi.updateNotificationIsReadById(notification.id!);
            useNotificationStore.setState((state) => ({
                notificationLists: state.notificationLists.map(n =>
                    n.id === notification.id ? {...n, isRead: 'Y'} : n
                ),
                totalNotificationCount: state.totalNotificationCount - 1,
            }));
            switch (notification.type) {
                case "chatroom" :
                    useChatStore.getState().selectRoomById(notificationRef);
                    navigate("/pot-list");
                    break;
                case "board" :
                    navigate(`/board/${notification.referenceId}`);
                    break;
            }
        }
    }

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                isOpen &&
                notificationRef.current &&
                !notificationRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isOpen])

    return (
        <MotionConfig transition={transition}>
            <div
                className="flex items-center justify-center w-8 h-8 rounded"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="fixed bottom-23 right-6 md:bottom-27 md:right-8 z-50">
                    <Button
                        className="cursor-pointer relative bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg w-12 h-12 md:w-16 md:h-16 transition-transform hover:scale-105">
                        {!isOpen ?
                            <Bell className="size-5 md:size-6"/>
                            :
                            <X className="size-5 md:size-6"/>
                        }
                    </Button>

                    {!isOpen && totalNotificationCount > 0 && (
                        <Badge
                            className="absolute top-0 right-0 w-5 h-5 md:w-6 md:h-6"
                            variant="destructive"
                        >
                            {totalNotificationCount}
                        </Badge>
                    )}
                </div>

                {isOpen && <X size={18} className="cursor-pointer text-white"/>}
            </div>
            <div className="fixed bottom-8 right-23 md:right-27 z-50 ms-2 md:ms-0 ">
                <motion.div
                    ref={notificationRef}
                    animate={{
                        height: isOpen ? "400px" : "0px",
                        width: isOpen ? "100%" : "0px",
                    }}
                    initial={false}
                    className={"flex flex-col shadow-md overflow-hidden bg-white rounded-md"}
                >
                    <div className="flex items-center justify-between px-4 py-2 bg-green-700">
                        {isOpen && (
                            <>
                                <span className="font-medium text-white">알림 목록</span>
                            </>
                        )}
                    </div>

                    {/* 알림 리스트 */}
                    {isOpen && (
                        <div className="flex-1 overflow-y-auto flex flex-col bg-white w-60">
                            {notificationList && notificationList.map((item) =>
                                <div
                                    key={item.id}
                                    className={`flex items-center justify-between px-4 py-2 text-xs transition
                                    ${item.isRead === 'Y' ? "" : "hover:bg-accent/50 bg-accent/30 cursor-pointer"}`}
                                >
                                        <span
                                            className="line-clamp-2 overflow-hidden text-ellipsis"
                                            onClick={() => handleOnClickNotification(item)}
                                        >
                                            {item.message}
                                        </span>

                                    <div className="flex flex-col items-end ms-1 gap-1 z-55 relative">
                                        <Button
                                            variant="secondary"
                                            className={`h-5 px-2 text-[10px] transition-colors ${item.isRead === 'Y'
                                                ? "text-muted-foreground border-muted-foreground cursor-default"
                                                : "cursor-pointer hover:bg-primary/30 hover:text-secondary-foreground"}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                notificationApi.updateNotificationIsReadById(item.id!).then(() => {
                                                    useNotificationStore.setState((state) => ({
                                                        notificationLists: state.notificationLists.map(n =>
                                                            n.id === item.id ? {...n, isRead: 'Y'} : n
                                                        ),
                                                        totalNotificationCount: state.totalNotificationCount - 1,
                                                    }));
                                                });
                                            }}
                                            disabled={item.isRead === 'N'}
                                        >
                                            읽음
                                        </Button>

                                        <Button
                                            variant="destructive"
                                            className="h-5 px-2 text-[10px] transition-colors cursor-pointer hover:bg-red-700"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                notificationApi.deleteNotificationById(item.id!).then(() => {
                                                    useNotificationStore.setState((state) => ({
                                                        notificationLists: state.notificationLists.filter(n => n.id !== item.id),
                                                        totalNotificationCount: state.totalNotificationCount - 1,
                                                    }));
                                                });
                                            }}
                                        >
                                            삭제
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            </div>
        </MotionConfig>
    )
}