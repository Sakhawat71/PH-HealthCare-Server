import { ErrorRequestHandler } from "express";
import { sendResponse } from "../utils/sendResponse";
import { StatusCodes } from "http-status-codes";


export const globalErrorHandler: ErrorRequestHandler = (
    error,
    req,
    res,
    next
) => {

    sendResponse(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        success: false,
        message: error.name,
        meta: error.meta,
        error: error
    })
};