import { Doctor } from './../../../../generated/prisma/index.d';
import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../helpers/fileUploader";
import { userValidation } from "./user.validation";
import { UserRole } from "@prisma/client";

const router = Router();


router.get(
    '/',
    auth(
        UserRole.ADMIN,
        UserRole.SUPER_ADMIN
    ),
    userController.getAllUser
);

router.get(
    '/me',
    auth(
        UserRole.ADMIN,
        UserRole.PATIENT,
        UserRole.PATIENT,
        UserRole.SUPER_ADMIN,
    ),
    userController.getMyProfile
);

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
);

router.post(
    '/create-patient',
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidation.createPatient.parse(JSON.parse(req.body.data))
        return userController.createPatient(req, res, next)
    },
);

router.patch(
    '/:id/status',
    auth(
        UserRole.ADMIN,
        UserRole.SUPER_ADMIN
    ),
    userController.updateUserStatus
);

router.patch(
    '/update-my-profile',
    auth(
        UserRole.ADMIN,
        UserRole.PATIENT,
        UserRole.PATIENT,
        UserRole.SUPER_ADMIN,
    ),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data);
        return userController.updateMyProfile(req, res, next)
    }
);

export const userRouter = router;
