import { IAuthUser } from "../../interfaces/common";
import prisma from "../../utils/prisma";

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
        data : doctorScheduleData
    })

    return result;
};

export const DoctorScheduleServices = {
    insertIntoDB,

};