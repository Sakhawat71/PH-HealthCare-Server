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
    options: IPaginationOptions
) => {

    const { limit, page, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, specialties, ...filterData } = filters;

    const andConditions: Prisma.DoctorSchedulesWhereInput[] = [];

    

    if (specialties && specialties.length > 0) {
        // Corrected specialties condition
        andConditions.push({
            doctorSpecialties: {
                some: {
                    specialties: {
                        title: {
                            contains: specialties,
                            mode: 'insensitive',
                        },
                    },
                },
            },
        });
    }

    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map(key => ({
            [key]: {
                equals: (filterData as any)[key],
            },
        }));
        andConditions.push(...filterConditions);
    }


    const whereConditions: Prisma.DoctorWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};


    const result = await prisma.doctorSchedules.findMany({
        include: {
            doctor: true,
            schedule: true,
        }
    });
    return result;
}

export const DoctorScheduleServices = {
    insertIntoDB,
    getAllFromDB,
};