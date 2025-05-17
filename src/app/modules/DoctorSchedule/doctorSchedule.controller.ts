import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { DoctorScheduleServices } from "./doctorSchedule.service";
import { StatusCodes } from "http-status-codes";
import { IAuthUser } from "../../interfaces/common";
import { pick } from "../Admin/admin.constant";

const insertIntoDB = catchAsync(async (
    req: Request & { user?: IAuthUser },
    res: Response
) => {
    const user = req.user;
    const result = await DoctorScheduleServices.insertIntoDB(user!, req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Doctor Data fetched!",
        // meta: result?.meta,
        data: result
    })
});

const getAllFromDB = catchAsync(async (req, res) => {
    const filters = pick(req.query, ['startDate', 'endDate', 'isBooked']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const user = req.user;
    const result = await DoctorScheduleServices.getAllFromDB(
        filters,
        options,
        user as IAuthUser
    );
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Doctors Schedule fetched!",
        // meta: result?.meta,
        data: result
    })
});

export const DoctorScheduleControllers = {
    insertIntoDB,
    getAllFromDB
};