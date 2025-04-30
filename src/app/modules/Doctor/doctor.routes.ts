import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";


const router = Router();

router.get(
    '/',
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),

);

router.get(
    '/:id',
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),

);

router.patch(
    '/:id',
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),


);

router.delete(
    '/:id',
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),

);

router.delete(
    '/soft/:id',
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),

);

export const DoctorRouter = router;