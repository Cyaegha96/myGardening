export function getRelativeTime(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if(diffMins <= 0) {
        return `방금 전`;
    }
    if(diffHours <= 0) {
        return `${diffMins}분 전`;
    }
    if (diffHours < 24) {
        return `${diffHours}시간 전`;
    }
    return `${diffDays}일 전`;
}