import { Router } from "express";
import { userRouter } from "../modules/User/user.route";
import { adminRoute } from "../modules/Admin/admin.route";
import { authRouter } from "../modules/Auth/auth.route";
import { SpecialtiesRoutes } from "../modules/Specialties/specialties.router";
import { DoctorRouter } from "../modules/Doctor/doctor.routes";
import { patientRoutes } from "../modules/Patient/patient.route";
import { ScheduleRouters } from "../modules/Schedule/schedule.route";
import { DoctorScheduleRouter } from "../modules/DoctorSchedule/doctorSchedule.route";

const router = Router();

const routersModule = [
    {
        path: '/user',
        route: userRouter
    },
    {
        path: '/admin',
        route: adminRoute
    },
    {
        path: '/auth',
        route: authRouter
    },
    {
        path: '/specialties',
        route: SpecialtiesRoutes
    },
    {
        path: '/doctor',
        route: DoctorRouter,
    },
    {
        path: '/patient',
        route: patientRoutes
    },
    {
        path: '/schedule',
        route: ScheduleRouters
    },
    {
        path: '/doctor-schedule',
        route: DoctorScheduleRouter
    }
];

routersModule.forEach((r) => {
    router.use(r.path, r.route);
});

export default router;