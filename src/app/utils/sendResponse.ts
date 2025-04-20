import { Response } from "express";

type TResponse<T> = {
    statusCode: number;
    success: boolean;
    message?: string;
    data?: T;
    meta?: {
        total?: number;
        page?: number;
        limit?: number;
        [key: string]: any;
    };

};


export const sendResponse = <T>(
    res: Response,
    data: TResponse<T>
) => {
    res.status(data.statusCode).json({
        success: data.success,
        message: data.message,
        meta: data.meta,
        data: data.data,
    })
}

// sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: 'Admin is retrieved succesfully',
//     data: result,
// });