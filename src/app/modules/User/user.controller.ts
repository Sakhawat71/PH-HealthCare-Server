import { Request, Response } from "express";
import { userServices } from "./user.service";

const createAdmin = async (req: Request, res: Response) => {

    const result = await userServices.createAdminInToDB(req.body);
    res.send({
        message: 'Admin created successfully',
        success : true,
        data: result
    });
};


export const userController = {
    createAdmin,
};