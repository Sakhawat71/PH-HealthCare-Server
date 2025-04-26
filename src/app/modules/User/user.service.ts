import { Prisma, PrismaClient, User, UserRole, } from "@prisma/client";
import bcrypt from 'bcrypt';
import AppError from "../../errors/appError";
import { StatusCodes } from "http-status-codes";
import { fileUploader } from "../../helpers/fileUploader";
import { Request } from "express";
import { paginationHelper } from "../../helpers/paginateionHelper";
import { userSearchAbleFields } from "./user.constant";

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
    const andConditions: Prisma.UserWhereInput[] = [];
    const { page, limit, sortBy, sortOrder, skip } = paginationHelper.calculatePagination(paginateQuery);

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
            }
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


export const userServices = {
    createAdminInToDB,
    createDoctorIntoDB,
    createPatientIntoDB,
    getAllUserFromDB,

};