import { Admin, Prisma, PrismaClient } from "@prisma/client";
import { adminSearchAbleFields } from "./admin.constant";
import { paginationHelper } from "../../helpers/paginateionHelper";

const prisma = new PrismaClient();

const getAllAdmin = async (params: any, paginateQuery: any) => {

    const { searchTerm, ...filterData } = params;
    const andConditions: Prisma.AdminWhereInput[] = [];
    const { page, limit, sortBy, sortOrder, skip } = paginationHelper.calculatePagination(paginateQuery);

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

    andConditions.push({
        isDeleted: false
    });

    const whereConditions: Prisma.AdminWhereInput = { AND: andConditions }
    try {
        const result = await prisma.admin.findMany({
            where: whereConditions,
            skip,
            take: limit,
            orderBy: sortBy && sortOrder ? {
                [sortBy]: sortOrder
            } : {
                createdAt: 'desc'
            }
        });

        const total = await prisma.admin.count({
            where: whereConditions
        });

        return {
            meta: {
                page,
                limit,
                total
            },
            deta: result as Admin[] | null
        };
    } catch (error) {
        console.log(error);
    }
};


const getAdminByIdFormDB = async (id: string): Promise<Admin | null> => {
    const result = await prisma.admin.findUnique({
        where: {
            id,
            isDeleted: false
        },
    });
    return result;
};


const updateAdminById = async (id: string, data: Partial<Admin>): Promise<Admin | null> => {

    await prisma.admin.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });

    const result = await prisma.admin.update({
        where: {
            id
        },
        data
    })
    return result;
};


const deleteAdminById = async (id: string) => {

    await prisma.admin.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });

    const result = await prisma.$transaction(async (tClient) => {
        const adminDeletedData = await tClient.admin.delete({
            where: {
                id
            }
        });

        await tClient.user.delete({
            where: {
                email: adminDeletedData.email
            }
        });

        return adminDeletedData;
    });
    return result;
};


const softDeleteAdmin = async (id: string) => {
    await prisma.admin.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });

    const result = await prisma.$transaction(async (tClient) => {
        const adminDeletedData = await tClient.admin.update({
            where: {
                id
            },
            data: {
                isDeleted: true
            }
        });

        await tClient.user.update({
            where: {
                email: adminDeletedData.email
            },
            data: {
                userStatus: 'DELETED'
            }
        });

        return adminDeletedData;
    });
    return result;
};


export const adminServices = {
    getAllAdmin,
    getAdminByIdFormDB,
    updateAdminById,
    deleteAdminById,
    softDeleteAdmin
};