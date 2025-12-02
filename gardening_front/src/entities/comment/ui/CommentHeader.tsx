export function CommentHeader({ nickname, time }: { nickname: string; time: string }) {
    return (
        <div className="flex items-start gap-2 text-sm font-semibold">
            <span>{nickname}</span>
            <span className="text-xs text-gray-400">{time}</span>
        </div>
    );
}