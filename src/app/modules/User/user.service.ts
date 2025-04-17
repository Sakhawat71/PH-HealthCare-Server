import { PrismaClient, UserRole } from "@prisma/client";


const prisma = new PrismaClient();

const createAdminInToDB = async (data: any) => {

    const userData = {
        email: data.admin.email,
        password: data.password,
        role: UserRole.ADMIN
    }

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