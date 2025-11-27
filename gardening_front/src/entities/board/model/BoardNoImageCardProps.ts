export interface BoardNoImageCardProps {
    id: number;

    title: string;
    contents: string;

    writerProfileImage?: string;
    writerNickname: string;
    writerBio?: string;

    likeCount?: number;
    viewCount?: number;
    commentCount?: number;

    tags?: string[];

    onClick?: (id: number) => void;
}
