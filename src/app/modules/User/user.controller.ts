import { Request, Response } from "express";
import { userServices } from "./user.service";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paginateAllowedFieds, pick } from "../Admin/admin.constant";
import { userFilterableFields } from "./user.constant";

const createAdmin = catchAsync(async (req: Request, res: Response) => {
    const result = await userServices.createAdminInToDB(req);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Admin created successfully',
        data: result
    });
});


const createDoctor = catchAsync(async (req: Request, res: Response) => {
    const result = await userServices.createDoctorIntoDB(req);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Doctor created successfully',
        data: result
    });
});


const createPatient = catchAsync(async (req: Request, res: Response) => {
    const result = await userServices.createPatientIntoDB(req);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Patient created successfully',
        data: result
    });
});


const getAllUser = catchAsync(async (req: Request, res: Response,) => {

    const filteredQuery = pick(req.query, userFilterableFields);
    const paginateQuery = pick(req.query, paginateAllowedFieds);
    const result = await userServices.getAllUserFromDB(filteredQuery, paginateQuery);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Users Data fetched!",
        meta: result?.meta,
        data: result?.deta
    });
});


const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await userServices.updateUserStatus(id, req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Users profile status changed!",
        data: result
    });
});


const getMyProfile = catchAsync(async (
    req: Request & {user? : any }, 
    res: Response
) => {
    const user = req.user;
    const result = await userServices.getMyProfile(user);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "profile Data fetched!",
        data: result
    });
});



export const userController = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllUser,
    updateUserStatus,
    getMyProfile
};