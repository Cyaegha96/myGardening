import { parseJwt } from "./parseJwt.ts";

export function getLoginUid(): string | null {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    const decoded = parseJwt(token);
    if (!decoded) return null;

    return decoded.sub || decoded.uid || null;
}