export interface DiaryCalendarPopupProps {
    selectedDate: Date;
    onSelect: (date: Date) => void;
    onClose: () => void;
}