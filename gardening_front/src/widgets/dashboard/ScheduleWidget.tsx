import { useEffect, useState } from "react";
import { Separator } from "@/shared/shadcn/components/ui/separator";
import { ScheduleControllerApi } from "@/shared/api";

type Schedule = {
    id: number;
    title: string;
    startDate: string;
    endDate: string;
};

export function ScheduleWidget() {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const api = new ScheduleControllerApi();
                const res = await api.getSchedules();
                const raw = res.data;

                // 배열이 아니면 배열로 감싸기
                const list = Array.isArray(raw) ? raw : [raw];

                setSchedules(list as Schedule[]);
            } catch (e) {
                console.error("Fail to load schedules", e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) {
        return <p className="text-sm text-muted-foreground">불러오는 중...</p>;
    }

    if (schedules.length === 0) {
        return <p className="text-sm text-muted-foreground">등록된 일정이 없습니다.</p>;
    }

    return (
        <div className="flex flex-col gap-3">
            {schedules.map((item) => (
                <div
                    key={item.id}
                    className="rounded-md border p-3 flex flex-col gap-1 hover:bg-muted/40 transition"
                >
                    <div className="font-medium flex justify-center">{item.title}</div>
                    <div className="text-xs text-muted-foreground flex justify-center">
                        {formatDate(item.startDate)} ~ {formatDate(item.endDate)}
                    </div>
                </div>
            ))}
            <Separator />

            <div className="text-right font-medium">
                <a href="/schedule" className="text-xs text-primary hover:underline ">
                    전체 일정 보기 →
                </a>
            </div>
        </div>
    );
}

function formatDate(dateString: string) {
    if (!dateString) return "";
    const d = new Date(dateString);
    return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(
        d.getMinutes()
    ).padStart(2, "0")}`;
}