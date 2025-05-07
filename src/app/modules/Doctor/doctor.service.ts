import { IDoctorFilterRequest, ISpecialty } from './doctor.interface';
import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/appError";
import prisma from "../../utils/prisma";
import { paginationHelper } from '../../helpers/paginateionHelper';
import { Prisma } from '@prisma/client';
import { IPaginationOptions } from '../../interfaces/pagination';
import { doctorSearchableFields } from './doctor.constants';

const getDoctorsFormDB = async (
    filters: IDoctorFilterRequest,
    options: IPaginationOptions,
) => {
    const { limit, page, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, specialties, ...filterData } = filters;

    const andConditions: Prisma.DoctorWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: doctorSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }

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

    andConditions.push({
        isDeleted: false,
    });

    const whereConditions: Prisma.DoctorWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.doctor.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : { createdAt: 'desc' },
        include: {
            doctorSpecialties: {
                include: {
                    specialties: true
                }
            }
        },
    });

    const total = await prisma.doctor.count({
        where: whereConditions,
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

    await prisma.$transaction(async transactionClient => {
        await transactionClient.doctor.update({
            where: {
                id
            },
            data: doctorData,
        });

        // delete and add specialtiesId
        if (specialties && specialties.length > 0) {

            // delete
            const deleteSpecialtiesIds: ISpecialty[] = specialties.filter((specialty: ISpecialty) => specialty.isDeleted);
            for (const specialty of deleteSpecialtiesIds) {
                await transactionClient.doctorSpecialties.deleteMany({
                    where: {
                        doctorId: docInfo.id,
                        specialitiesId: specialty.specialtiesId
                    }
                });
            };

            // create
            const createSpecialtiesIds: ISpecialty[] = specialties.filter((specialty: ISpecialty) => !specialty.isDeleted);
            for (const specialty of createSpecialtiesIds) {
                await transactionClient.doctorSpecialties.create({
                    data: {
                        doctorId: docInfo.id,
                        specialitiesId: specialty.specialtiesId
                    }
                });
            };
        };
    });

    const result = await prisma.doctor.findUnique({
        where: {
            id: docInfo.id
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialties: true
                }
            }
        }
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