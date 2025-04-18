import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const createAdminInToDB = async (data: any) => {

    const hashedPassword = await bcrypt.hash(data.password,12);
    const userData = {
        email: data.admin.email,
        password: hashedPassword,
        role: UserRole.ADMIN
    };

    const result = await prisma.$transaction(async (tClient) => {
        // create user
        const createUserData = await tClient.user.create({
            data: userData
        });

        // create admin
        const createAdminData = await tClient.admin.create({
            data: data.admin
        });

        return createAdminData;
    });

    return result;
};

export const userServices = {
    createAdminInToDB,
};