import { Router } from "express";
import { adminControllers } from "./admin.controller";
import validateReqest, { update } from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";


const router = Router();

router.get(
    '/',
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    adminControllers.getAllAdmin
);

router.get(
    '/:id',
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    adminControllers.getAdminById
);

router.patch(
    '/:id',
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    validateReqest(update),
    adminControllers.updateAdminById
);

router.delete(
    '/:id',
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    adminControllers.deleteAdmin
);

router.delete(
    '/soft/:id',
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    adminControllers.softDeleteAdmin
);

export const adminRoute = router;