import {
    CloudRainIcon,
    DropletsIcon,
    SunIcon,
    ThermometerIcon,
    WindIcon,
} from "lucide-react";
import {Widget, WidgetContent} from "@/shared/shadcn/components/ui/widget.tsx";
import {Label} from "@/shared/shadcn/components/ui/label.tsx";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/shared/shadcn/components/ui/tooltip.tsx";
import {useEffect, useState} from "react";


interface WeatherData {
    name: string;
    main: {
        temp: number;
        feels_like: number;
        humidity: number;
    };
    wind: {
        speed: number;
    };
    weather: {
        icon: string;
        main: string;
    }[];
}

export default function WeatherWidget() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchWeather = async () => {

            try {
                const res = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?q=Seoul&appid=${
                        import.meta.env.VITE_OPENWEATHER_API_KEY
                    }&units=metric&lang=kr`

                );

                if (!res.ok) throw new Error("날씨 정보를 불러오지 못했습니다.");

                const data = await res.json();
                setWeather(data);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    if (loading) {
        return (
            <Widget size="md">
                <WidgetContent>
                    <div className="flex justify-center py-10">⏳ 날씨 불러오는 중...</div>
                </WidgetContent>
            </Widget>
        );
    }

    if (error) {
        return (
            <Widget size="md">
                <WidgetContent>
                    <div className="text-center text-red-500 py-10">{error}</div>
                </WidgetContent>
            </Widget>
        );
    }

    return (
        <Widget size="md">
            <WidgetContent>
                <div className="flex w-full flex-col items-center justify-center gap-3">
                    <SunIcon className="size-16 stroke-amber-300" />
                    <div className="flex flex-col items-center justify-center gap-2">
                        <Label className="text-3xl">{weather?.main.temp}°C</Label>
                        <Label>{weather?.name ?? "대한민국"}</Label>
                    </div>
                </div>

                <div className="flex w-full flex-col items-center justify-center gap-5">
                    <div className="flex w-full items-center justify-center gap-16">
                        <InfoItem icon={WindIcon} label="풍속" value={`${weather?.wind.speed} m/s`} />
                        <InfoItem
                            icon={ThermometerIcon}
                            label="체감온도"
                            value={`${weather?.main.feels_like}°`}
                        />
                    </div>
                    <div className="flex w-full items-center justify-center gap-16">
                        <InfoItem
                            icon={CloudRainIcon}
                            label="날씨"
                            value={weather?.weather[0].main ?? ""}
                        />
                        <InfoItem
                            icon={DropletsIcon}
                            label="습도"
                            value={`${weather?.main.humidity}%`}
                        />
                    </div>
                </div>
            </WidgetContent>
        </Widget>
    );
}

type InfoItemProps = {
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    label: string;
    value: string;
};

const InfoItem = (el: InfoItemProps) => {
    return (
        <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
                <div className="space-y-2">
                    <el.icon className="stroke-muted-foreground size-6" />
                    <Label className="text-base font-normal">{el.value}</Label>
                </div>
            </TooltipTrigger>
            <TooltipContent>
                <Label className="text-sm font-normal">{el.label}</Label>
            </TooltipContent>
        </Tooltip>
    );
};