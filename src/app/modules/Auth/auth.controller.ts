import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { authServices } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";


const loginUser = catchAsync(async (req: Request, res: Response) => {
    const result = await authServices.loginUser(req.body);

    const { refreshToken } = result;

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
    })

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "login success",
        data: {
            accesstoken: result.accessToken,
            needPasswordChange: result.needPasswordChange,
        }
    })
});


export const authControllers = {
    loginUser
};