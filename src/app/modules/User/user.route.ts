import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../helpers/fileUploader";

const router = Router();


router.post(
    '/',
    auth(
        UserRole.ADMIN,
        UserRole.SUPER_ADMIN
    ),
    fileUploader.upload.single('file'),
    userController.createAdmin
);


export const userRouter = router;
