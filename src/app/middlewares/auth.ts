import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/appError";
import { StatusCodes } from "http-status-codes";
import config from '../config';


const auth = (...roles: string[]) => {
    return catchAsync(async (
        req: Request & {user?: any},
        res: Response,
        next: NextFunction
    ) => {

        const token = req.headers.authorization;
        if (!token) {
            throw new AppError(
                StatusCodes.UNAUTHORIZED,
                "You are not Authorized!"
            );
        };

        const decoded = jwt.verify(
            token,
            config.jwt_secret as string
        ) as JwtPayload;
        if (!decoded) {
            throw new AppError(
                StatusCodes.UNAUTHORIZED,
                'You are not Authorized'
            );
        };

        if(roles.length && !roles.includes(decoded.role)){
            throw new AppError(
                StatusCodes.UNAUTHORIZED,
                "You are not Authorized"
            );
        };

        req.user = decoded;

        next();
    })
};


export default auth;