export function CommentEditArea({
                                    value,
                                    onChange,
                                }: {
    value: string;
    onChange: (txt: string) => void;
}) {
    return (
        <textarea
            className="w-full border rounded p-2 text-sm mt-1"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    );
}