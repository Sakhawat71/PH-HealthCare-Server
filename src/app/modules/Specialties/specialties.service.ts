import { Request } from "express";
import { fileUploader } from "../../helpers/fileUploader";
import prisma from "../../utils/prisma";


const insertIntoDB = async (req: Request) => {

    const file = req.file;
    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.icon = uploadToCloudinary?.secure_url;
    };

    console.log( {
        title :  req.body.title,
        icon : req.body.icon
    });

    const result = await prisma.specialties.create({
        data: {
            title :  req.body.title,
            icon : req.body.icon
        }
    })

    return result;
};


export const specialtiesServices = {
    insertIntoDB,
};