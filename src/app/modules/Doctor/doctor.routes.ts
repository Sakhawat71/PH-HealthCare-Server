import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { doctorControllers } from "./doctor.controller";


const router = Router();

router.get(
    '/',
    doctorControllers.getAllDoctors
);

router.get(
    '/:id',
    doctorControllers.getDoctorById
);

router.patch(
    '/:id',
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    doctorControllers.updateDoctor
);

// router.delete(
//     '/:id',
//     auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),

// );

router.delete(
    '/soft/:id',
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    doctorControllers.softDeleteDoctorById
);

export const DoctorRouter = router;