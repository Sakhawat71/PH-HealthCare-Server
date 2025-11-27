import { Router } from "express";
import { ScheduleControllers } from "./schedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";


const router = Router();

router.get(
    '/',
    auth(UserRole.DOCTOR),
    ScheduleControllers.getAllFromDB
);

router.get(
    '/:id',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
    ScheduleControllers.getById
);

router.post(
    '/',
    auth(UserRole.SUPER_ADMIN,UserRole.ADMIN),
    ScheduleControllers.inserIntoDB
);

router.delete(
    '/:id',
    auth(UserRole.SUPER_ADMIN,UserRole.ADMIN),
    ScheduleControllers.deleteById
);

export const ScheduleRouters = router;