import { Prisma, PrismaClient } from "@prisma/client";
import { adminSearchAbleFields } from "./admin.constant";

const prisma = new PrismaClient();

const getAllAdmin = async (params: any) => {

    const { searchTerm, ...filterData } = params;
    const andConditions: Prisma.AdminWhereInput[] = [];

    if (params.searchTerm) {
        andConditions.push({
            OR: adminSearchAbleFields.map(field => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: 'insensitive',
                }
            }))
        })
    };

    if(Object.keys(filterData).length > 0){
        andConditions.push({
            AND : Object.keys(filterData).map(key => ({
                [key] : {
                    equals : filterData[key]
                }
            }))
        })
    };

    const whereConditions: Prisma.AdminWhereInput = { AND: andConditions }
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