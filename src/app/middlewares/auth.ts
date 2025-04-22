import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/appError";
import { StatusCodes } from "http-status-codes";


const auth = (...roles: string[]) => {
    return catchAsync(async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const token = req.headers.authorization;
        if (!token) {
            throw new AppError(
                StatusCodes.UNAUTHORIZED,
                "Unauthorized"
            )
        }
        console.log(token);


        // console.log(roles);

        next();
    })
};


export default auth;