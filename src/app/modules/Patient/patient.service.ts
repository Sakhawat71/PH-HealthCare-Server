import prisma from "../../utils/prisma";


const getAllPatient = async (
    filters : any,
    options : any
) => {


    return await prisma.patient.findMany({
        where: {
            isDeleted: false
        }
    });
};


export const patientServices = {
    getAllPatient
};