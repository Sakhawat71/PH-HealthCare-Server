import { IAuthUser } from "../../interfaces/common";
import prisma from "../../utils/prisma";

const insertIntoDB = async (
    user: IAuthUser,
    payload: {
        schduleIds: string[]
    }
) => {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email,
        },
    });

    const doctorScheduleData = payload.schduleIds.map(scheduleId => ({
        doctorId: doctorData.id,
            scheduleId
    }));

    console.log(doctorScheduleData);

    return doctorData;
};

export const DoctorScheduleServices = {
    insertIntoDB,

};