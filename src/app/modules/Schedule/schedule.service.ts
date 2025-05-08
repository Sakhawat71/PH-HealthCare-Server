import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../utils/prisma";

const inserIntoDB = async (payload: any) => {

    const { startDate, endDate, startTime, endTime } = payload;
    const intervaltime = 30;
    const schedules = [];

    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);

    while (currentDate <= lastDate) {
        const startDateTime = new Date(
            addHours(
                format(currentDate, 'yyyy-MM-dd'),
                Number(startTime.split(':')[0])
            )
        );

        const endDateTime = new Date(
            addHours(
                format(lastDate, 'yyyy-MM-dd'),
                Number(endTime.split(':')[0])
            )
        );

        while (startDateTime < endDateTime) {
            const scheduleDate = {
                startDateTime: startDateTime,
                endDateTime: addMinutes(startDateTime, intervaltime)
            }

            const result = await prisma.schedule.create({
                data: scheduleDate
            });
            schedules.push(result);
            startDateTime.setMinutes(startDateTime.getMinutes() + intervaltime);
        }
        currentDate.setDate(currentDate.getDate() + 1)

    }
    return schedules;
};

export const ScheduleServices = {
    inserIntoDB,
}