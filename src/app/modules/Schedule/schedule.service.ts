import prisma from "../../utils/prisma";

const inserIntoDB = async (payload: any) => {
    const result = await prisma.schedule.create({
        data: payload
    });
    return result;
};

export const ScheduleServices = {
    inserIntoDB,
}