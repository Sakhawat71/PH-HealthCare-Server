import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from 'bcrypt';
import AppError from "../../errors/appError";
import { StatusCodes } from "http-status-codes";
import { fileUploader } from "../../helpers/fileUploader";

const prisma = new PrismaClient();

const createAdminInToDB = async (req: any) => {


    // console.log(data.file)
    // console.log(data.body.data);

    const file = req.file;
    if(file){
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.admin.profilePhoto = uploadToCloudinary?.secure_url;
        
        console.log(JSON.parse(req.body.data));
    }

    // const hashedPassword = await bcrypt.hash(data.password, 12);
    // const userData = {
    //     email: data.admin.email,
    //     password: hashedPassword,
    //     role: UserRole.ADMIN
    // };

    // const isExist = await prisma.user.findUnique({
    //     where: {
    //         email: userData.email
    //     }
    // });

    // if (isExist) {
    //     throw new AppError(
    //         StatusCodes.CONFLICT,
    //         'User with this email already exists'
    //     );
    // }

    // const result = await prisma.$transaction(async (tClient) => {
    //     // create user
    //     const createUserData = await tClient.user.create({
    //         data: userData
    //     });

    //     // create admin
    //     const createAdminData = await tClient.admin.create({
    //         data: data.admin
    //     });

    //     return createAdminData;
    // });

    // return result;
    return JSON.parse(req.body.data)
};

export const userServices = {
    createAdminInToDB,
};