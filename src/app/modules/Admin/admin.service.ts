import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllAdmin = async () => {
    try {
        const result = await prisma.admin.findMany();
        return result;
    } catch (error) {
        console.log(error);
    }
};

export const adminServices = {
    getAllAdmin,
    
};