import { Router } from "express";
import { adminControllers } from "./admin.controller";


const router = Router();

router.get('/', adminControllers.getAllAdmin);
router.get('/:id', adminControllers.getAdminById);
router.patch('/:id', adminControllers.updateAdminById);

export const adminRoute = router;