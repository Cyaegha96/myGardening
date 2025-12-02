const DEFAULT_AVATAR = "/images/default-profile.png";

export function CommentAvatar({ src }: { src?: string }) {
    return (
        <img
            src={src || DEFAULT_AVATAR}
            className="w-8 h-8 rounded-full"
            alt="profile"
        />
    );
}
