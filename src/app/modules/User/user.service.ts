import { Prisma, PrismaClient, User, UserRole, } from "@prisma/client";
import bcrypt from 'bcrypt';
import AppError from "../../errors/appError";
import { StatusCodes } from "http-status-codes";
import { fileUploader } from "../../helpers/fileUploader";
import { Request } from "express";
import { paginationHelper } from "../../helpers/paginateionHelper";
import { userSearchAbleFields } from "./user.constant";
import { IAuthUser } from "../../interfaces/common";

const prisma = new PrismaClient();

const createAdminInToDB = async (req: Request) => {

    const file = req.file;
    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file) as { secure_url: string };
        req.body.admin.profilePhoto = uploadToCloudinary.secure_url;
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const userData = {
        email: req.body.admin.email,
        password: hashedPassword,
        role: UserRole.ADMIN
    };

    const isExist = await prisma.user.findUnique({
        where: {
            email: userData.email
        }
    });

    if (isExist) {
        throw new AppError(
            StatusCodes.CONFLICT,
            'User with this email already exists'
        );
    }

    const result = await prisma.$transaction(async (tClient) => {
        // create user
        const createUserData = await tClient.user.create({
            data: userData
        });

        // create admin
        const createAdminData = await tClient.admin.create({
            data: req.body.admin
        });

        return createAdminData;
    });

    return result;
};

const createDoctorIntoDB = async (req: Request) => {
    const file = req.file;
    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file) as { secure_url: string };
        req.body.doctor.profilePhoto = uploadToCloudinary.secure_url;
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const userData = {
        email: req.body.doctor.email,
        password: hashedPassword,
        role: UserRole.DOCTOR
    };

    const isExist = await prisma.user.findUnique({
        where: {
            email: userData.email
        }
    });

    if (isExist) {
        throw new AppError(
            StatusCodes.CONFLICT,
            'User with this email already exists'
        );
    }

    const result = await prisma.$transaction(async (tClient) => {
        // create user
        const createUserData = await tClient.user.create({
            data: userData
        });

        // create doctor
        const createDoctor = await tClient.doctor.create({
            data: req.body.doctor
        });

        return createDoctor;
    });

    return result;
};

const createPatientIntoDB = async (req: Request) => {
    const file = req.file;
    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file) as { secure_url: string };
        req.body.patient.profilePhoto = uploadToCloudinary.secure_url;
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const userData = {
        email: req.body.patient.email,
        password: hashedPassword,
        role: UserRole.PATIENT
    };

    const isExist = await prisma.user.findUnique({
        where: {
            email: userData.email
        }
    });

    if (isExist) {
        throw new AppError(
            StatusCodes.CONFLICT,
            'User with this email already exists'
        );
    }

    const result = await prisma.$transaction(async (tClient) => {
        // create user
        const createUserData = await tClient.user.create({
            data: userData
        });

        // create Patient
        const createPatient = await tClient.patient.create({
            data: req.body.patient
        });

        return createPatient;
    });

    return result;
};

const getAllUserFromDB = async (params: any, paginateQuery: any) => {

    const { searchTerm, ...filterData } = params;
    const { page, limit, sortBy, sortOrder, skip } = paginationHelper.calculatePagination(paginateQuery);
    const andConditions: Prisma.UserWhereInput[] = [];

    if (params.searchTerm) {
        andConditions.push({
            OR: userSearchAbleFields.map(field => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: 'insensitive',
                }
            }))
        })
    };

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: filterData[key]
                }
            }))
        })
    };


    const whereConditions: Prisma.UserWhereInput = { AND: andConditions }
    try {
        const result = await prisma.user.findMany({
            where: whereConditions,
            skip,
            take: limit,
            orderBy: sortBy && sortOrder ? {
                [sortBy]: sortOrder
            } : {
                createdAt: 'desc'
            },
            select: {
                id: true,
                email: true,
                role: true,
                needPasswordChange: true,
                userStatus: true,
                createdAt: true,
                updatedAt: true,
                Admin: true,
                doctor: true,
                Patient: true
            },
        });

        const total = await prisma.user.count({
            where: whereConditions
        });

        return {
            meta: {
                page,
                limit,
                total
            },
            deta: result
        };
    } catch (error) {
        console.log(error);
    }
};

const updateUserStatus = async (id: string, status: UserRole) => {
    const userData = await prisma.user.findUnique({
        where: {
            id
        }
    });
    if (!userData) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            "User not found"
        )
    }

    const updateUserStatus = await prisma.user.update({
        where: {
            id
        },
        data: status
    });

    return updateUserStatus;
};

const getMyProfile = async (user: any) => {
    const userInfo = await prisma.user.findUnique({
        where: {
            email: user.email
        },
        select: {
            id: true,
            email: true,
            role: true,
            userStatus: true,
            needPasswordChange: true,
            createdAt: true,
            updatedAt: true
        }
    });
    if (!userInfo) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            "user not found"
        )
    }

    let userProfile;
    if (userInfo?.role === "ADMIN") {
        userProfile = await prisma.admin.findUniqueOrThrow({
            where: {
                email: userInfo.email
            }
        })
    }

    if (userInfo?.role === "SUPER_ADMIN") {
        userProfile = await prisma.admin.findUniqueOrThrow({
            where: {
                email: userInfo.email
            }
        })
    }

    if (userInfo?.role === "PATIENT") {
        userProfile = await prisma.patient.findUniqueOrThrow({
            where: {
                email: userInfo.email
            }
        })
    }

    if (userInfo?.role === "DOCTOR") {
        userProfile = await prisma.doctor.findUniqueOrThrow({
            where: {
                email: userInfo.email
            }
        })
    }


    return { ...userInfo, ...userProfile }
};

const updateMyProfile = async (
    user: IAuthUser,
    req: Request
) => {

    const userInfo = await prisma.user.findUnique({
        where: {
            email: user?.email,
            userStatus: "ACTIVE"
        },
    });
    if (!userInfo) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            "user not found"
        )
    };

    const file = req.file;
    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file) as { secure_url: string };
        req.body.profilePhoto = uploadToCloudinary?.secure_url;
    };

    let userProfile;
    if (userInfo?.role === "ADMIN") {
        userProfile = await prisma.admin.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        })
    }

    if (userInfo?.role === "SUPER_ADMIN") {
        userProfile = await prisma.admin.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        })
    }

    if (userInfo?.role === "PATIENT") {
        userProfile = await prisma.patient.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        })
    }

    if (userInfo?.role === "DOCTOR") {
        userProfile = await prisma.doctor.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        })
    }
    return { ...userProfile }
};


export const userServices = {
    createAdminInToDB,
    createDoctorIntoDB,
    createPatientIntoDB,
    getAllUserFromDB,
    updateUserStatus,
    getMyProfile,
    updateMyProfile
};