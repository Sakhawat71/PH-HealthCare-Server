import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { DoctorScheduleServices } from "./doctorSchedule.service";
import { StatusCodes } from "http-status-codes";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
    const result = await DoctorScheduleServices.insertIntoDB(req);
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