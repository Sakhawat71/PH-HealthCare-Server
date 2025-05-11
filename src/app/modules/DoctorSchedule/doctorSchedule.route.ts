import { Router } from "express";
import { DoctorScheduleControllers } from "./doctorSchedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post(
    '/',
    auth(UserRole.DOCTOR),
    DoctorScheduleControllers.insertIntoDB
);

export const DoctorScheduleRouter = router;