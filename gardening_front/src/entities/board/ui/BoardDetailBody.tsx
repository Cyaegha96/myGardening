interface BoardDetailBodyProps {
    title: string;
    contents: string;
    createdAt?: string;
}

export default function BoardDetailBody({
                                            title,
                                            contents,
                                            createdAt
                                        }: BoardDetailBodyProps) {
    return (
        <>
            <h1 className="text-xl font-semibold mb-4">
                {title}
            </h1>

            <div className="text-[15px] leading-relaxed whitespace-pre-line mb-6">
                {contents}
            </div>

            {createdAt && (
                <div className="text-xs text-gray-400 mb-5 text-right">
                    {new Date(createdAt).toLocaleString()}
                </div>
            )}
        </>
    );
}