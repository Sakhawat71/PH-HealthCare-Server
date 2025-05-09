import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../utils/prisma";
import { Schedule } from "@prisma/client";
import { ISchedules } from "./schedule.interface";

const inserIntoDB = async (payload: ISchedules): Promise<Schedule[]> => {

    const { startDate, endDate, startTime, endTime } = payload;
    const intervaltime = 30;
    const schedules = [];

    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);

    while (currentDate <= lastDate) {
        const startDateTime = new Date(
            addMinutes(
                addHours(
                    format(currentDate, 'yyyy-MM-dd'),
                    Number(startTime.split(':')[0])
                ),
                Number(startTime.split(':')[1])
            )
        );

        const endDateTime = new Date(
            addMinutes(
                addHours(
                    format(lastDate, 'yyyy-MM-dd'),
                    Number(endTime.split(':')[0])
                ),
                Number(endTime.split(':')[1])
            )
        );

        while (startDateTime < endDateTime) {
            const scheduleDate = {
                startDateTime: startDateTime,
                endDateTime: addMinutes(startDateTime, intervaltime)
            }

            const existingSchedule = await prisma.schedule.findFirst({
                where: {
                    startDateTime: scheduleDate.startDateTime,
                    endDateTime: scheduleDate.endDateTime,
                }
            });

            if (!existingSchedule) {
                const result = await prisma.schedule.create({
                    data: scheduleDate
                });
                schedules.push(result);
            }


            startDateTime.setMinutes(startDateTime.getMinutes() + intervaltime);
        }
        currentDate.setDate(currentDate.getDate() + 1)

    }
    return schedules;
};

export const ScheduleServices = {
    inserIntoDB,
}