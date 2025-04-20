import { Router } from "express";
import { adminControllers } from "./admin.controller";


const router = Router();

router.get('/', adminControllers.getAllAdmin);
router.get('/:id', adminControllers.getAdminById);
router.patch('/:id', adminControllers.updateAdminById);
router.delete('/:id', adminControllers.deleteAdmin);
router.delete('/soft/:id', adminControllers.softDeleteAdmin);

export const adminRoute = router;