import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/appError";
import prisma from "../../utils/prisma";

const getDoctorsFormDB = async () => {
    return prisma.doctor.findMany({
        where: {
            isDeleted: false
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialties: true
                }
            }
        }
    });
};

const getDoctorById = async (id: string) => {
    const doctor = await prisma.doctor.findUnique({
        where: {
            id,
            isDeleted: false
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialties: true
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
            id,
            isDeleted: false
        }
    });
    if (!isExist) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            'doctor not found!'
        );
    };

    return prisma.$transaction(async transactionClient => {
        const deleteDoctor = await transactionClient.doctor.delete({
            where: { id }
        });

        await transactionClient.user.update({
            where: {
                email: deleteDoctor.email
            },
            data: {
                userStatus: "DELETED"
            }
        });
        return deleteDoctor;
    });
};

const updateDoctorIntoDB = async (id: string, payload: any) => {
    const { specialties, ...doctorData } = payload;
    console.log("specialties", specialties);
    const docInfo = await prisma.doctor.findUnique({
        where: {
            id,
            isDeleted: false
        }
    });
    if (!docInfo) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            'doctor not found!'
        );
    };

    const result = await prisma.$transaction(async transactionClient => {
        const updatedDoctor = await transactionClient.doctor.update({
            where: {
                id
            },
            data: doctorData,
            include: {
                doctorSpecialties: {
                    include: {
                        specialties: true
                    }
                }
            }
        });

        // delete and add specialtiesId
        if (specialties && specialties.length > 0) {

            // delete
            const deleteSpecialtiesIds = specialties.filter(specialty => specialty.isDeleted);
            for (const specialty of deleteSpecialtiesIds) {
                const deleteDoctorSpecialties = await transactionClient.doctorSpecialties.deleteMany({
                    where: {
                        doctorId: docInfo.id,
                        specialitiesId: specialty.specialtiesId
                    }
                });
            };

            // add
            const createSpecialtiesIds = specialties.filter(specialty => !specialty.isDeleted);
            for (const specialty of createSpecialtiesIds) {
                const createDoctorSpecialties = await transactionClient.doctorSpecialties.create({
                    data: {
                        doctorId: docInfo.id,
                        specialitiesId: specialty.specialtiesId
                    }
                });
            };
        };

        return updatedDoctor;
    });
    return result;
};

const softDeleteDoctor = async (id: string) => {
    const isExist = await prisma.doctor.findUnique({
        where: {
            id,
            isDeleted: false
        }
    });
    if (!isExist) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            'doctor not found!'
        );
    };

    return await prisma.$transaction(async transactionClient => {
        const deleteDoctor = await transactionClient.doctor.update({
            where: {
                id,
                isDeleted: false
            },
            data: {
                isDeleted: true
            }
        });

        await transactionClient.user.update({
            where: {
                email: deleteDoctor.email,
            },
            data: {
                userStatus: "DELETED"
            }
        })
    })
};

export const doctorServices = {
    getDoctorsFormDB,
    getDoctorById,
    deleteDoctor,
    updateDoctorIntoDB,
    softDeleteDoctor,
};