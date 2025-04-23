import multer from "multer";
import path from "path";
import { v2 as cloudinary } from 'cloudinary';
import AppError from "../errors/appError";
import { StatusCodes } from "http-status-codes";


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), '/uploads'))
    },
    filename: function (req, file, cb) {

        cb(null, file.originalname)
    }
});

const upload = multer({ storage: storage });



// Configuration
cloudinary.config({
    cloud_name: 'dbgiyghuf',
    api_key: '815324725584527',
    api_secret: '<your_api_secret>' // Click 'View API Keys' above to copy your API secret
});


const uploadToCloudinary = async (file : any) => {
    const uploadResult = await cloudinary.uploader
        .upload(
            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
            public_id: 'shoes',
        }
        )
        .catch((error) => {
            console.log(error);
            throw new AppError(
                StatusCodes.FAILED_DEPENDENCY,
                "Failed to upload image"
            )
        });

    console.log(uploadResult);
};



export const fileUploader = {
    upload
};