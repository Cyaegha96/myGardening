export interface CommentWriterButtonsProps {
    onDelete: () => void;
    onEdit?: () => void;
    onReport?: () => void;
    mine?: boolean;
}