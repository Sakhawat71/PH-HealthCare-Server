import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { pick } from "../Admin/admin.constant";
import { patientServices } from "./patient.service";
import { patientFilterableFields } from "./patient.constant";

const getAllPatients = catchAsync(async (req, res) => {
    const filters = pick(req.query, patientFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await patientServices.getAllPatient(filters, options);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Patient retrieval successfully',
        // meta: result.meta,
        data: result,
    });
});




export const patientControllers = {
    getAllPatients,

};