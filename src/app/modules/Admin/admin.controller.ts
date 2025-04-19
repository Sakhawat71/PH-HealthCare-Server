import { Request, Response } from "express";
import { adminServices } from "./admin.service";
import { StatusCodes } from "http-status-codes";
import { adminAllowedFields, paginateAllowedFieds, pick } from "./admin.constant";



const getAllAdmin = async (req: Request, res: Response) => {
    try {
        const filteredQuery = pick(req.query, adminAllowedFields);
        const paginateQuery = pick(req.query, paginateAllowedFieds);
        const result = await adminServices.getAllAdmin(filteredQuery,paginateQuery);
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Admin Data fetched!',
            data: result
        })
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({
            success: true,
            message: 'Admin Data failed to fatch!',
            error: error
        })
    }
};

export const adminControllers = {
    getAllAdmin,

};