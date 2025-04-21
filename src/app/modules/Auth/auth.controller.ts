import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { authServices } from "./auth.service";


const loginUser = catchAsync(async (req: Request , res : Response)=> {
    const result = await authServices.loginUser();
    res.status(200).json({
        result
    });
});


export const authControllers = {
    loginUser
};