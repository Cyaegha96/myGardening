import {Card, CardContent, CardHeader, CardTitle} from "@/shared/shadcn/components/ui/card";
import {Separator} from "@/shared/shadcn/components/ui/separator.tsx";
import DashboardFeature from "@/features/auth/dashboard/DashboardFeature.tsx";
import WeatherWidget from "@/widgets/dashboard/WeatherWidget.tsx";
import {ScheduleWidget} from "@/widgets/dashboard/ScheduleWidget.tsx";
import {BoardWidget} from "@/widgets/dashboard/BoardWidget.tsx";
import {PotWidget} from "@/widgets/dashboard/PotWidget.tsx";
import {MyPlantWidget} from "@/widgets/dashboard/MyPlantWidget.tsx";

export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-6 p-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">대시보드</h1>
                <p className="text-sm text-muted-foreground">
                    나의 가드닝 활동 현황을 한눈에 확인해보세요.
                </p>
            </div>

            <Separator />


            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                {/* 프로필 */}
                <Card>
                    <CardHeader>
                        <CardTitle>프로필</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DashboardFeature />
                    </CardContent>
                </Card>

                {/* 날씨 */}
                <Card>
                    <CardHeader>
                        <CardTitle>오늘의 날씨</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center items-center">
                        <WeatherWidget />
                    </CardContent>
                </Card>

                {/* 내 게시글 */}
                <Card>
                    <CardHeader>
                        <CardTitle>내 게시글</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <BoardWidget />
                    </CardContent>
                </Card>


                {/* 스케줄 */}
                <Card>
                    <CardHeader>
                        <CardTitle>등록한 일정</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScheduleWidget />
                    </CardContent>
                </Card>

                {/* ️ 분양글 */}
                <Card>
                    <CardHeader>
                        <CardTitle>내 분양글</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <PotWidget/>
                    </CardContent>
                </Card>

                {/* ️ 내 식물 */}
                <Card>
                    <CardHeader>
                        <CardTitle>내가 등록한 식물</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <MyPlantWidget/>
                    </CardContent>
                </Card>


            </div>
        </div>
    );
}