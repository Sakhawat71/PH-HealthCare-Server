import { Prisma } from "@prisma/client";
import { paginationHelper } from "../../helpers/paginateionHelper";
import { IAuthUser } from "../../interfaces/common";
import prisma from "../../utils/prisma";
import { IPaginationOptions } from "../../interfaces/pagination";

const insertIntoDB = async (
    user: IAuthUser,
    payload: {
        scheduleIds: string[];
    }
) => {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email,
        },
    });

    // if (!payload.scheduleIds || !Array.isArray(payload.scheduleIds)) {
    //     throw new Error('scheduleIds must be a valid array');
    // }

    const doctorScheduleData = payload.scheduleIds.map(scheduleId => ({
        doctorId: doctorData.id,
        scheduleId
    }));

    const result = await prisma.doctorSchedules.createMany({
        data: doctorScheduleData
    })

    return result;
};

const getAllFromDB = async (
    filters: any,
    options: IPaginationOptions,
    user : IAuthUser
) => {

    const { limit, page, skip } = paginationHelper.calculatePagination(options);
    const { startDate, endDate, ...filterData } = filters;
    console.log(filterData)

    const andConditions = [];

    if (startDate && endDate) {
        andConditions.push({
            AND: [
                {
                    schedule: {
                        startDateTime: {
                            gte: startDate
                        }
                    }
                },
                {
                    schedule: {
                        endDateTime: {
                            lte: endDate
                        }
                    }
                }
            ]
        })
    };


    if (Object.keys(filterData).length > 0) {

        if (typeof filterData.isBooked === 'string' && filterData.isBooked === 'true') {
            filterData.isBooked = true
        }
        else if (typeof filterData.isBooked === 'string' && filterData.isBooked === 'false') {
            filterData.isBooked = false
        }

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

    const whereConditions: Prisma.DoctorSchedulesWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};


    const result = await prisma.doctorSchedules.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy:
            options.sortBy && options.sortOrder
                ? { [options.sortBy]: options.sortOrder }
                : {

                }
    });
    const total = await prisma.doctorSchedules.count({
        where: whereConditions
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

export const DoctorScheduleServices = {
    insertIntoDB,
    getAllFromDB,
};