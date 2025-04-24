import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from 'bcrypt';
import AppError from "../../errors/appError";
import { StatusCodes } from "http-status-codes";
import { fileUploader } from "../../helpers/fileUploader";
import { Request } from "express";

const prisma = new PrismaClient();

const createAdminInToDB = async (req: Request) => {

    const file = req.file;
    if(file){
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

export const userServices = {
    createAdminInToDB,
};