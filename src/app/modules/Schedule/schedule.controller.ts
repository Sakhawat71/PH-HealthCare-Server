import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { ScheduleServices } from "./schedule.service";

const inserIntoDB = catchAsync(async (req: Request, res: Response) => {
    const result = await ScheduleServices.inserIntoDB(req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Schedule created successfully!",
        data: result
    });
});

export const ScheduleControllers = {
    inserIntoDB
};