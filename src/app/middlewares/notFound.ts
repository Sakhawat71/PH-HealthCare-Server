import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";


const notFound = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    res.status(StatusCodes.NOT_FOUND).json({
        success : false,
        message : 'api not found',
        error : {
            path :  req.originalUrl,
            method : req.method,
            message : 'Your requested path is not found'
        }
    })
};

export default notFound;