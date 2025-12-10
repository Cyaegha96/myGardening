import {format} from "date-fns";
import {CalendarIcon} from "lucide-react";
import type {ControllerRenderProps, UseFormReturn} from "react-hook-form";
import {Button} from "@/shared/shadcn/components/ui/button.tsx";
import {Calendar} from "@/shared/shadcn/components/ui/calendar.tsx";
import {FormControl, FormItem, FormLabel, FormMessage,} from "@/shared/shadcn/components/ui/form.tsx";
import {Popover, PopoverContent, PopoverTrigger,} from "@/shared/shadcn/components/ui/popover.tsx";
import {ScrollArea, ScrollBar} from "@/shared/shadcn/components/ui/scroll-area.tsx";
import {cn} from "@/shared/shadcn/lib/utils.ts";
import {useCalendar} from "@/features/schedule/model/calendar-context.tsx";
import type {TEventFormData} from "@/entities/schedule/calendar/schemas.ts";
import {ko} from "date-fns/locale/ko";

interface DatePickerProps {
    form: UseFormReturn<TEventFormData>;
    field: ControllerRenderProps<TEventFormData, "endDate" | "startDate">;
}

export function DateTimePicker({form, field}: DatePickerProps) {
    const {use24HourFormat} = useCalendar();

    function handleDateSelect(date: Date | undefined) {
        if (date) {
            form.setValue(field.name, date);
        }
    }

    function handleTimeChange(type: "hour" | "minute" | "ampm", value: string) {
        const currentDate = form.getValues(field.name) || new Date();
        const newDate = new Date(currentDate);

        if (type === "hour") {
            // 12시간제에서는 1~12로 입력받음, 내부적으로 0~23로 변환
            const hours = parseInt(value, 10);
            if (!use24HourFormat) {
                const isPM = newDate.getHours() >= 12;
                newDate.setHours(hours % 12 + (isPM ? 12 : 0));
            } else {
                newDate.setHours(hours);
            }
        } else if (type === "minute") {
            newDate.setMinutes(parseInt(value, 10));
        } else if (type === "ampm") {
            if (!use24HourFormat) {
                const hours = newDate.getHours();
                if (value === "AM" && hours >= 12) {
                    newDate.setHours(hours - 12);
                } else if (value === "PM" && hours < 12) {
                    newDate.setHours(hours + 12);
                }
            }
            // 24시간제에서는 AM/PM 버튼이 없으므로 아무것도 안 함
        }

        form.setValue(field.name, newDate);
    }


    return (
        <FormItem className="flex flex-col">
            <FormLabel>
                {field.name === "startDate" ? "시작 날짜" : "종료 날짜"}
            </FormLabel>
            <Popover modal={true}>
                <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                            )}
                        >
                            {field.value ? (
                                format(
                                    field.value,
                                    use24HourFormat ? "yyyy/MM/dd HH:mm" : "yyyy/MM/dd aa hh:mm",
                                    {locale: ko}
                                )
                            ) : (
                                <span>yyyy/MM/dd aa HH:mm</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                        </Button>
                    </FormControl>
                </PopoverTrigger>
                <PopoverContent
                    className={"!fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:static sm:translate-y-1 w-auto p-4 z-50"}
                >
                    <div className="sm:flex">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={handleDateSelect}
                            initialFocus
                        />
                        {!use24HourFormat && (
                            <div className="flex gap-2 p-2 justify-center sm:flex-col sm:gap-0 sm:p-0">
                                {["AM", "PM"].map((period) => (
                                    <Button
                                        key={period}
                                        size="icon"
                                        variant={
                                            field.value && (field.value.getHours() < 12 ? "AM" : "PM") === period
                                                ? "default"
                                                : "ghost"
                                        }
                                        className="sm:aspect-square"
                                        onClick={() => handleTimeChange("ampm", period)}
                                    >
                                        {period === "AM" ? "오전" : "오후"}
                                    </Button>
                                ))}
                            </div>
                        )}
                        <div className="flex flex-col sm:flex-row sm:h-[332px] divide-y sm:divide-y-0 sm:divide-x">
                            <ScrollArea className="w-64 sm:w-auto">
                                <div className="flex sm:flex-col p-2">
                                    {Array.from({ length: use24HourFormat ? 24 : 12 }, (_, i) => i + (!use24HourFormat ? 1 : 0))
                                        .map((hour12) => {
                                            let hour24;

                                            if (use24HourFormat) {
                                                hour24 = hour12;
                                            } else {
                                                hour24 = hour12 % 12;
                                                if (field.value?.getHours() >= 12) {
                                                    hour24 += 12;
                                                }
                                            }

                                            const isSelected =
                                                field.value &&
                                                field.value.getHours() === hour24;

                                            return (
                                                <Button
                                                    key={hour12}
                                                    size="icon"
                                                    variant={isSelected ? "default" : "ghost"}
                                                    className="sm:w-full shrink-0 aspect-square"
                                                    onClick={() => handleTimeChange("hour", hour24.toString())}
                                                >
                                                    {hour12.toString().padStart(2, "0")}
                                                </Button>
                                            );
                                        })}
                                </div>
                                <ScrollBar orientation="horizontal" className="sm:hidden"/>
                            </ScrollArea>
                            <ScrollArea className="w-64 sm:w-auto">
                                <div className="flex sm:flex-col p-2">
                                    {Array.from({length: 12}, (_, i) => i * 5).map((minute) => (
                                        <Button
                                            key={minute}
                                            size="icon"
                                            variant={
                                                field.value && field.value.getMinutes() === minute
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            className="sm:w-full shrink-0 aspect-square"
                                            onClick={() =>
                                                handleTimeChange("minute", minute.toString())
                                            }
                                        >
                                            {minute.toString().padStart(2, "0")}
                                        </Button>
                                    ))}
                                </div>
                                <ScrollBar orientation="horizontal" className="sm:hidden"/>
                            </ScrollArea>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
            <FormMessage/>
        </FormItem>
    );
}
