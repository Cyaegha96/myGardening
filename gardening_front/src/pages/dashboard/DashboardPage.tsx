import {Card, CardContent, CardHeader, CardTitle} from "@/shared/shadcn/components/ui/card";
import {Separator} from "@/shared/shadcn/components/ui/separator.tsx";
import DashboardFeature from "@/features/auth/dashboard/DashboardFeature.tsx";
import WeatherWidget from "@/widgets/dashboard/WeatherWidget.tsx";
import {SocialWidget} from "@/widgets/dashboard/SocialWidget.tsx";

export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-6 p-6">
            {/* Top Header */}
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">대시보드</h1>
                <p className="text-sm text-muted-foreground">
                    나의 가드닝 활동 현황을 한눈에 확인해보세요.
                </p>
            </div>

            <Separator />

            {/* GRID LAYOUT */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <Card className="col-span-1 md:col-span-2 xl:col-span-3">
                    <CardHeader>
                        <CardTitle>프로필</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DashboardFeature />
                    </CardContent>
                </Card>
                {/* 👉 물주기 카운트 */}
                {/*<Card className="col-span-1 md:col-span-1 xl:col-span-1">*/}
                {/*    <CardHeader>*/}
                {/*        <CardTitle>물주기 현황</CardTitle>*/}
                {/*    </CardHeader>*/}
                {/*    <CardContent>*/}
                {/*        <WateringCountWidget />*/}
                {/*    </CardContent>*/}
                {/*</Card>*/}

                {/* 👉 날씨 */}
                <Card className="col-span-1 md:col-span-1 xl:col-span-1">
                    <CardHeader>
                        <CardTitle>오늘의 날씨</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <WeatherWidget />
                    </CardContent>
                </Card>

                {/* 👉 스케줄 요약 */}
                {/*<Card className="col-span-1 md:col-span-2 xl:col-span-1">*/}
                {/*    <CardHeader>*/}
                {/*        <CardTitle>등록한 일정</CardTitle>*/}
                {/*    </CardHeader>*/}
                {/*    <CardContent>*/}
                {/*        <ScheduleWidget />*/}
                {/*    </CardContent>*/}
                {/*</Card>*/}

                {/* 👉 내 식물 요약 */}
                {/*<Card className="col-span-1 md:col-span-2 xl:col-span-2">*/}
                {/*    <CardHeader>*/}
                {/*        <CardTitle>내 식물</CardTitle>*/}
                {/*    </CardHeader>*/}
                {/*    <CardContent>*/}
                {/*        <MyPlantsWidget />*/}
                {/*    </CardContent>*/}
                {/*</Card>*/}

                {/* 👉 팔로잉 */}
                {/*<Card className="col-span-1 xl:col-span-1">*/}
                {/*    <CardHeader>*/}
                {/*        <CardTitle>팔로잉</CardTitle>*/}
                {/*    </CardHeader>*/}
                {/*    <CardContent>*/}
                {/*        <FollowingWidget />*/}
                {/*    </CardContent>*/}
                {/*</Card>*/}

                {/* 👉 팔로워 */}
                <Card className="col-span-1 xl:col-span-1">
                    <CardHeader>
                        <CardTitle>소셜</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <SocialWidget />
                    </CardContent>
                </Card>

                {/* 👉 게시글 */}
                {/*<Card className="col-span-1 md:col-span-2 xl:col-span-3">*/}
                {/*    <CardHeader>*/}
                {/*        <CardTitle>내 게시글</CardTitle>*/}
                {/*    </CardHeader>*/}
                {/*    <CardContent>*/}
                {/*        <PostsWidget />*/}
                {/*    </CardContent>*/}
                {/*</Card>*/}

            </div>
        </div>
    );
}