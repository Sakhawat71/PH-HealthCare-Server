import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/appError";
import prisma from "../../utils/prisma";

const getDoctorsFormDB = async () => {
    return prisma.doctor.findMany();
};

const getDoctorById = async (id: string) => {
    const doctor = await prisma.doctor.findUnique({
        where: {
            id,
            isDeleted : false
        },
        include : {
            doctorSpecialties: {
                include: {
                    specialties : true
                }
            }
        }
    });

    if (!doctor) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            'doctor not found!'
        );
    };

    return doctor;
};

const deleteDoctor = async (id: string) => {
    const isExist = await prisma.doctor.findUnique({
        where: {
            id
        }
    });
    if (!isExist) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            'doctor not found!'
        );
    };

    return prisma.doctor.update({
        where: {
            id
        },
        data: {
            isDeleted: true
        }
    });
};

export const doctorServices = {
    getDoctorsFormDB,
    getDoctorById,
    deleteDoctor
};