import { Request, Response } from "express";
import { userServices } from "./user.service";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

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


export const userController = {
    createAdmin,
    createDoctor,
    createPatient
};