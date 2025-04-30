import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse";
import { doctorServices } from "./doctor.service";


const getAllDoctors = catchAsync(async (req, res) => {
    const result = await doctorServices.getDoctorsFormDB();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Admin Data fetched!",
        // meta: result?.meta,
        data: result
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




export const doctorControllers = {
    getAllDoctors,
    getDoctorById,

};