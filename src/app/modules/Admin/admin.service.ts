import { Prisma, PrismaClient } from "@prisma/client";
import { adminSearchAbleFields } from "./admin.constant";
import { paginationHelper } from "../../helpers/paginateionHelper";

const prisma = new PrismaClient();

const getAllAdmin = async (params: any, paginateQuery: any) => {

    const { searchTerm, ...filterData } = params;
    const andConditions: Prisma.AdminWhereInput[] = [];
    const { page, limit, sortBy, sortOrder,skip } = paginationHelper.calculatePagination(paginateQuery);

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

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: filterData[key]
                }
            }))
        })
    };

    const whereConditions: Prisma.AdminWhereInput = { AND: andConditions }
    try {
        const result = await prisma.admin.findMany({
            where: whereConditions,
            skip ,
            take: limit,
            orderBy: sortBy && sortOrder ? {
                [sortBy]: sortOrder
            } : {
                createdAt: 'desc'
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