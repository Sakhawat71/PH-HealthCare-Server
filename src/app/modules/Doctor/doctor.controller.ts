import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse";
import { doctorServices } from "./doctor.service";
import { pick } from "../Admin/admin.constant";
import { doctorFilterableFields } from "./doctor.constants";


const getAllDoctors = catchAsync(async (req, res) => {
    const filters = pick(req.query, doctorFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await doctorServices.getDoctorsFormDB(filters, options);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Doctor Data fetched!",
        meta: result?.meta,
        data: result.data
    })
});


const getDoctorById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await doctorServices.getDoctorById(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Doctor Data fetched!",
        data: result
    })
});


const softDeleteDoctorById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await doctorServices.softDeleteDoctor(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Doctor deleted!",
        data: null
    });
});


const updateDoctor = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await doctorServices.updateDoctorIntoDB(id, req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Doctor updated!",
        data: result
    });
});


export const doctorControllers = {
    getAllDoctors,
    getDoctorById,
    softDeleteDoctorById,
    updateDoctor,
};