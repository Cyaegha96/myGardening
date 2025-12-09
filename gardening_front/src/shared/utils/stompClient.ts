import {Client} from "@stomp/stompjs";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import SockJS from "sockjs-client/dist/sockjs.min";

export const stompClient = new Client({
    webSocketFactory: () => new SockJS("http://localhost:8081/ws"),
    connectHeaders: {
        Authorization: "Bearer " + localStorage.getItem("accessToken")
    },
    onConnect: () => {
        console.log("Connected!");
    }
});
