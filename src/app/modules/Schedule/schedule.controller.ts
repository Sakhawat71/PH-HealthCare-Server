import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { ScheduleServices } from "./schedule.service";
import { pick } from "../Admin/admin.constant";

const inserIntoDB = catchAsync(async (req: Request, res: Response) => {
    const result = await ScheduleServices.inserIntoDB(req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Schedule created successfully!",
        data: result
    });
});

const getAllFromDB = catchAsync(async (req, res) => {
    const filters = pick(req.query, ['startDateTime','endDateTime']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await ScheduleServices.getAllFromDB(filters, options);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Schedule fetched!",
        meta: result?.meta,
        data: result.data
    })
});

export const ScheduleControllers = {
    inserIntoDB,
    getAllFromDB
};