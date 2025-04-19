import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllAdmin = async (params: any) => {

    const andConditions : Prisma.AdminWhereInput[] = [];

    if (params.searchTerm) {
        andConditions.push({
            OR: [
                {
                    name: {
                        contains: params.searchTerm,
                        mode: 'insensitive',
                    }
                },
                {
                    email: {
                        contains: params.searchTerm,
                        mode: 'insensitive',
                    }
                }
            ]
        })
    }

    const whereConditions : Prisma.AdminWhereInput  = {AND : andConditions}

    try {
        const result = await prisma.admin.findMany({
            where: whereConditions
        });
        return result;
    } catch (error) {
        console.log(error);
    }
};

export const adminServices = {
    getAllAdmin,

};