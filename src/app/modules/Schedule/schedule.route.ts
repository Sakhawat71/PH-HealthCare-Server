import { Router } from "express";
import { ScheduleControllers } from "./schedule.controller";


const router = Router();

router.post(
    '/',
    ScheduleControllers.inserIntoDB
)

export const ScheduleRouters = router;