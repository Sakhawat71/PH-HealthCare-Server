import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { authServices } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";


const loginUser = catchAsync(async (
    req: Request,
    res: Response
) => {
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


const refreshToken = catchAsync(async (
    req: Request,
    res: Response
) => {
    const { refreshToken } = req.cookies;
    const result = await authServices.refreshToken(refreshToken);
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: 'create accesstoken',
        data: result
    });
});

// reset password
const changePassword = catchAsync(async (
    req: Request & { user?: any },
    res: Response
) => {
    const user = req.user;
    const result = await authServices.changePassword(user, req.body);
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: 'password change successfully',
        data: result
    })
});


// forgotPassword
const forgotPassword = catchAsync(async (req: Request, res: Response) => {
    const result = await authServices.forgotPassword(req.body);
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: 'password retrive successfully',
        data: result
    })
});


export const authControllers = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword
};