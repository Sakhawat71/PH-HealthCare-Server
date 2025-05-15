import { Router } from "express";
import { ScheduleControllers } from "./schedule.controller";


const router = Router();

router.get(
    '/',
    ScheduleControllers.getAllFromDB
);

router.post(
    '/',
    ScheduleControllers.inserIntoDB
);

export const ScheduleRouters = router;