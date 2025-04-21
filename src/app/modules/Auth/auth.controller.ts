import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { authServices } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";


const loginUser = catchAsync(async (req: Request , res : Response)=> {
    const result = await authServices.loginUser(req.body);
    sendResponse(res,{
        statusCode: StatusCodes.OK,
        success: true,
        message : "login success",
        data : result
    })
});


export const authControllers = {
    loginUser
};