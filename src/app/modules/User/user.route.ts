import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../helpers/fileUploader";
import { userValidation } from "./user.validation";
import { UserRole } from "@prisma/client";

const router = Router();

router.post(
    '/create-admin',
    auth(
        UserRole.ADMIN,
        UserRole.SUPER_ADMIN
    ),
    fileUploader.upload.single('file'),

    (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidation.createAdmin.parse(JSON.parse(req.body.data))
        return userController.createAdmin(req, res, next)
    },
    // userController.createAdmin
);

router.post(
    '/create-doctor',
    auth(
        UserRole.ADMIN,
        UserRole.SUPER_ADMIN
    ),
    fileUploader.upload.single('file'),

    (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidation.createDoctor.parse(JSON.parse(req.body.data))
        return userController.createDoctor(req, res, next)
    },
    // userController.createAdmin
);


export const userRouter = router;
