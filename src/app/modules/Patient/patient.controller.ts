import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { pick } from "../Admin/admin.constant";
import { patientServices } from "./patient.service";
import { patientFilterableFields } from "./patient.constant";
import { Request, Response } from "express";

const getAllPatients = catchAsync(async (req, res) => {
    const filters = pick(req.query, patientFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await patientServices.getAllFromDB(filters, options);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Patient retrieval successfully',
        meta: result.meta,
        data: result.data,
    });
});


const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.params;
    const result = await patientServices.getByIdFromDB(id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Patient retrieval successfully',
        data: result,
    });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await patientServices.updateIntoDB(id, req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Patient updated successfully',
        data: result,
    });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await patientServices.deleteFromDB(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Patient deleted successfully',
        data: result,
    });
});


const softDelete = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await patientServices.softDelete(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Patient soft deleted successfully',
        data: result,
    });
});





export const patientControllers = {
    getAllPatients,
    getByIdFromDB,
    updateIntoDB,
    deleteFromDB,
    softDelete
};