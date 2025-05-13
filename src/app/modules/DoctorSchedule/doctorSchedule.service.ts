import { Request } from "express";
import prisma from "../../utils/prisma";

const insertIntoDB = async (req: Request) => {
    const doctorData = await prisma.doctor.findUnique({
        where: {
            email : req.user.email,
        }
    });

    // console.log(req.body.scheduleIds);

    return doctorData;
};

export const DoctorScheduleServices = {
    insertIntoDB,

};