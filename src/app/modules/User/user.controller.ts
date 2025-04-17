import { Request, Response } from "express";
import { userServices } from "./user.service";

const createAdmin = async (req: Request, res: Response) => {
    const result = await userServices.createAdminInToDB();
    res.send(result);
};


export const userController = {
    createAdmin,
};