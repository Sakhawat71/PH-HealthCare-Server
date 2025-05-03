import prisma from "../../utils/prisma";


const getAllPatient = async () => {
    return await prisma.patient.findMany({
        where :{
            isDeleted : false
        }
    });
};


export const patientServices = {
    getAllPatient
};