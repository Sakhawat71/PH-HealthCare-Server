import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { specialtiesServices } from "./specialties.service";


const insertIntoDB = catchAsync(async (
    req: Request,
    res: Response
) => {
    const result = await specialtiesServices.insertIntoDB();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "insert Into Db!",
        data: result
    });
});

export const specialtiesController = {
    insertIntoDB,
};