import {Client} from "@stomp/stompjs";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import SockJS from "sockjs-client/dist/sockjs.min";

const baseUrl:string = import.meta.env.VITE_API_BASE_URL;

export const stompClient = new Client({
    webSocketFactory: () => new SockJS(baseUrl + "/ws"),
    connectHeaders: {
        Authorization: "Bearer " + localStorage.getItem("accessToken")
    },
    onConnect: () => {
        console.log("Connected!");
    }
});
