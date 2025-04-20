import { NextFunction, Request, Response } from "express";
import { adminServices } from "./admin.service";
import { StatusCodes } from "http-status-codes";
import { adminAllowedFields, paginateAllowedFieds, pick } from "./admin.constant";
import { sendResponse } from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";



const getAllAdmin = catchAsync(async (req: Request, res: Response,) => {

    const filteredQuery = pick(req.query, adminAllowedFields);
    const paginateQuery = pick(req.query, paginateAllowedFieds);
    const result = await adminServices.getAllAdmin(filteredQuery, paginateQuery);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Admin Data fetched!",
        meta: result?.meta,
        data: result?.deta
    });

});


const getAdminById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await adminServices.getAdminByIdFormDB(id as string);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Admin Data fetched!",
        data: result
    })

});


const updateAdminById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const result = await adminServices.updateAdminById(id, req.body);
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Admin Data Updated!',
            data: result
        });
    } catch (error) {
        next(error)
    }
};


const deleteAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const result = await adminServices.deleteAdminById(id);
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Admin Data Deleted!',
            data: null
        })
    } catch (error: any) {
        res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: error?.name || 'Admin Data failed to delete!',
            error: error
        })
    }
};



const softDeleteAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const result = await adminServices.softDeleteAdmin(id);
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Admin Data Deleted!',
            data: result
        })
    } catch (error: any) {
        res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: error?.name || 'Admin Data failed to delete!',
            error: error
        })
    }
};

export const adminControllers = {
    getAllAdmin,
    getAdminById,
    updateAdminById,
    deleteAdmin,
    softDeleteAdmin
};