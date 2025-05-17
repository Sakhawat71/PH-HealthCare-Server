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

router.post(
    '/',
    ScheduleControllers.inserIntoDB
);

export const ScheduleRouters = router;