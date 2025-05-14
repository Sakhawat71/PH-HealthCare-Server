import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { DoctorScheduleServices } from "./doctorSchedule.service";
import { StatusCodes } from "http-status-codes";
import { IAuthUser } from "../../interfaces/common";

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

export const DoctorScheduleControllers = {
    insertIntoDB,

};