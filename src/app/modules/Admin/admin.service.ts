import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllAdmin = async (params: any) => {
    try {
        const result = await prisma.admin.findMany({
            where: {
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
            }
        });
        return result;
    } catch (error) {
        console.log(error);
    }
};

export const adminServices = {
    getAllAdmin,

};