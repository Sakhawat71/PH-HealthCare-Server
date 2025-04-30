import { Request } from "express";
import { fileUploader } from "../../helpers/fileUploader";
import prisma from "../../utils/prisma";
import { ICloudinaryResponse, IFile } from "../../interfaces/file";


const insertIntoDB = async (req: Request) => {

    const file = req.file as IFile;
    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file) as ICloudinaryResponse;
        req.body.icon = uploadToCloudinary?.secure_url;
    };

    const result = await prisma.specialties.create({
        data: {
            title: req.body.title,
            icon: req.body.icon
        }
    })

    return result;
};


export const specialtiesServices = {
    insertIntoDB,
};