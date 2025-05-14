import { Request } from "express";
import prisma from "../../utils/prisma";

const insertIntoDB = async (req: Request) => {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email : req.user.email,
        },
    });

    const doctorScheduleData = await 

    console.log(req.body.scheduleIds);

    return doctorData;
};

export const DoctorScheduleServices = {
    insertIntoDB,

};