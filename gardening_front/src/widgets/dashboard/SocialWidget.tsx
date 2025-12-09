import {useEffect, useState} from "react";
import {Card, CardContent,} from "@/shared/shadcn/components/ui/card.tsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/shared/shadcn/components/ui/tabs";
import {Avatar, AvatarFallback, AvatarImage} from "@/shared/shadcn/components/ui/avatar.tsx";
import {Button} from "@/shared/shadcn/components/ui/button.tsx";
import {UserFollowControllerApi, type UserInfoDTO} from "@/shared/api";
import useUserStore from "@/app/store/userStore.ts";

export function SocialWidget() {

    interface FollowUser {
        id: string;
        nickname: string;
        profileImage: string;
    }

    const [followers, setFollowers] = useState<FollowUser[]>([]);
    const [following, setFollowing] = useState<FollowUser[]>([]);

    const uid = useUserStore((state) => state.uid);
    const followApi = new UserFollowControllerApi();

    useEffect(() => {
        if (!uid) return; // uid 없으면 API 호출 X
        loadData(uid);
    }, [uid]);

    const loadData = async (uid:string) => {
        const [followerRes, followingRes] = await Promise.all([
            followApi.getFollowers(uid),
            followApi.getFollowings(uid),
        ]);
        const mappedFollowers: FollowUser[] = followerRes.data.map((u: UserInfoDTO) => ({
            id: u.uuid ?? "",
            nickname: u.nickname ?? "",
            profileImage: u.profileUrl ?? "",
        }));

        const mappedFollowing = followingRes.data.map((u: UserInfoDTO) => ({
            id: u.uuid ?? "",
            nickname: u.nickname ?? "",
            profileImage: u.profileUrl ?? "",
        }));

        setFollowers(mappedFollowers);
        setFollowing(mappedFollowing);
    };

    return (
        <Card className="w-full h-auto">
            <CardContent>
                <Tabs defaultValue="followers" className="w-full">

                    <TabsList className="w-full grid grid-cols-2">
                        <TabsTrigger value="followers">팔로워</TabsTrigger>
                        <TabsTrigger value="following">팔로잉</TabsTrigger>
                    </TabsList>

                    {/* Followers */}
                    <TabsContent value="followers" className="space-y-4 pt-4">
                        {followers.map((user) => (
                            <div key={user.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={user.profileImage} />
                                        <AvatarFallback>{user.nickname[0]}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{user.nickname}</span>
                                </div>
                                <Button variant="outline">프로필</Button>
                            </div>
                        ))}
                    </TabsContent>

                    {/* Following */}
                    <TabsContent value="following" className="space-y-4 pt-4">
                        {following.map((user: any) => (
                            <div key={user.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={user.profileImage} />
                                        <AvatarFallback>{user.nickname[0]}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{user.nickname}</span>
                                </div>
                                <Button variant="destructive">언팔로우</Button>
                            </div>
                        ))}
                    </TabsContent>

                </Tabs>
            </CardContent>
        </Card>
    );
}