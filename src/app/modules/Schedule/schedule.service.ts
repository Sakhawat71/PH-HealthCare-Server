import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../utils/prisma";
import { Prisma, Schedule } from "@prisma/client";
import { ISchedules } from "./schedule.interface";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../helpers/paginateionHelper";
import { IAuthUser } from "../../interfaces/common";

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

const getAllFromDB = async (
    filters: any,
    options: IPaginationOptions,
    user: IAuthUser
) => {

    const { limit, page, skip } = paginationHelper.calculatePagination(options);
    const { startDate, endDate, ...filterData } = filters;

    const andConditions: Prisma.ScheduleWhereInput[] = [];

    if (startDate && endDate) {
        andConditions.push({
            AND: [
                {
                    startDateTime: {
                        gte: startDate
                    }
                },
                {
                    endDateTime: {
                        lte: endDate
                    }
                }
            ]
        })
    };


    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => {
                return {
                    [key]: {
                        equals: (filterData as any)[key],
                    },
                };
            }),
        });
    }

    const whereConditions: Prisma.ScheduleWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

    const doctorSchedules = await prisma.doctorSchedules.findMany({
        where: {
            doctor: {
                email: user?.email
            }
        }
    });

    const doctorScheduleIds = doctorSchedules.map(schedule => schedule.scheduleId);

    const result = await prisma.schedule.findMany({
        where: {
            ...whereConditions,
            id: {
                notIn: doctorScheduleIds
            }
        },
        skip,
        take: limit,
        orderBy:
            options.sortBy && options.sortOrder
                ? { [options.sortBy]: options.sortOrder }
                : {
                    createdAt: 'desc',
                }
    });
    const total = await prisma.schedule.count({
        where: {
            ...whereConditions,
            id: {
                notIn: doctorScheduleIds
            }
        },
    });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };

};

export const ScheduleServices = {
    inserIntoDB,
    getAllFromDB,
};