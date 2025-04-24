import multer from "multer";
import path from "path";
import { v2 as cloudinary } from 'cloudinary';
import AppError from "../errors/appError";
import { StatusCodes } from "http-status-codes";
import fs from "fs";

// Configuration
cloudinary.config({
    cloud_name: 'dbgiyghuf',
    api_key: '815324725584527',
    api_secret: '871ZSsP0FIaL3W9ZasDTGz8K7_Q'
});


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), '/uploads'))
    },
    filename: function (req, file, cb) {

        cb(null, file.originalname)
    }
});

// console.log(path.join(process.cwd(), '/uploads'));
const upload = multer({ storage: storage });


const uploadToCloudinary = async (file: any) => {

    // console.log({ file });
    return new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload(
                file.path, {
                public_id: file.originalname,
            }, (error, result) => {
                fs.unlinkSync(file.path)
                if (error) {
                    reject(error)
                } else {
                    resolve(result)
                }
            })

    })
};



export const fileUploader = {
    upload,
    uploadToCloudinary
};