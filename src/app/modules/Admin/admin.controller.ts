import { Request, Response } from "express";
import { adminServices } from "./admin.service";
import { StatusCodes } from "http-status-codes";


const getAllAdmin = async (req: Request, res: Response) => {
    try {

        const allowedFields = ['name','searchTerm','email','contactNumber'];
        const filteredQuery : Record<string,any> = {};

        for(const key of allowedFields){
            if(req.query[key]){
                filteredQuery[key] = req.query[key]
            }
        };

        console.log(filteredQuery);

        const result = await adminServices.getAllAdmin(filteredQuery);
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Admin Data fetched!',
            data: result
        })
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({
            success: true,
            message: 'Admin Data failed to fatch!',
            error: error
        })
    }
};

export const adminControllers = {
    getAllAdmin,

};