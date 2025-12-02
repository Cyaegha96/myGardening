import type { BoardResponseDTO } from "@/shared/api";
import { Button } from "@/shared/shadcn/components/ui/button.tsx";

export default function BoardDetailHeader({ data }: { data: BoardResponseDTO }) {
    return (
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow p-6 mb-6">
            <div className="flex items-center gap-4">

                {/* 프로필 이미지 */}
                <img
                    src={data.writerProfileImage || "/default-profile.png"}
                    alt="profile"
                    className="w-16 h-16 rounded-full object-cover"
                />

                {/* 닉네임 / Bio / 팔로우 버튼 */}
                <div className="flex flex-col">
                    <span className="font-semibold text-lg">{data.writerNickname}</span>
                    <span className="text-sm text-gray-500 mb-2">
                        {data.writerBio || ""}
                    </span>

                    {/* 팔로우 버튼 (프로필 아래) */}
                    <Button variant="outline" className="w-fit text-xs px-3 py-1">
                        팔로우
                    </Button>
                </div>

                {/* 팔로워 & 팔로잉 (같은 줄) */}
                <div className="ml-auto flex items-center gap-3 text-sm text-gray-600">
                    <span>
                        팔로워 <span className="font-semibold">{data.followerCount ?? 0}</span>
                    </span>
                    <span>
                        팔로잉 <span className="font-semibold">{data.followingCount ?? 0}</span>
                    </span>
                </div>
            </div>
        </div>
    );
}
