import { Request, Response } from "express";
import { userServices } from "./user.service";
import { StatusCodes } from "http-status-codes";

const createAdmin = async (req: Request, res: Response) => {
    try {
        const result = await userServices.createAdminInToDB(req.body);
        res.status(StatusCodes.OK).send({
            message: 'Admin created successfully',
            success: true,
            data: result
        });
    } catch (error: any) {
        res.status(500).json({
            succrss: false,
            message: error?.name || "Something went wrong",
            error
        })
    }
};


export const userController = {
    createAdmin,
};