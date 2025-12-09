import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs.min";

export const stompClient = new Client({
    webSocketFactory: () => new SockJS("http://localhost:8081/ws"),
    connectHeaders: {
        Authorization: "Bearer " + localStorage.getItem("accessToken")
    },
    onConnect: () => {
        console.log("Connected!");

        stompClient.subscribe("/topic/messages", msg => {
            console.log("Received:", JSON.parse(msg.body));
        });
    }
});
