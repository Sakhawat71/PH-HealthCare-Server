import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { specialtiesServices } from "./specialties.service";


const insertIntoDB = catchAsync(async (
    req: Request,
    res: Response
) => {
    const result = await specialtiesServices.insertIntoDB(req);
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Specialties created successfully!",
        data: result
    });
});


// get
const getSpecialties = catchAsync(async (req, res) => {
    const result = await specialtiesServices.getSpecialties();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Specialties get successfully!",
        data: result
    })
});


// delete
const deleteSpecialties = catchAsync(async (req, res) => {
    const id = req.params.id;
    const result = await specialtiesServices.deleteSpecialtiesFromDB(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Specialties deleted successfully!",
        data: null
    })
})

export const specialtiesController = {
    insertIntoDB,
    getSpecialties,
    deleteSpecialties
};