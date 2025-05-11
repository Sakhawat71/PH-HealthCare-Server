import prisma from "../../utils/prisma";

const insertIntoDB = async (user: any) => {
    const doctorData = await prisma.doctor.findUnique({
        where: {
            email : user.email,
        }
    });

    return doctorData;
};

export const DoctorScheduleServices = {
    insertIntoDB,

};