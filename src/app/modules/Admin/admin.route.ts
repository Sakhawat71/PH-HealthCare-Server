import { Router } from "express";
import { adminControllers } from "./admin.controller";
import validateReqest, { update } from "../../middlewares/validateRequest";


const router = Router();

router.get('/', adminControllers.getAllAdmin);
router.get('/:id', adminControllers.getAdminById);
router.patch('/:id', validateReqest(update), adminControllers.updateAdminById);
router.delete('/:id', adminControllers.deleteAdmin);
router.delete('/soft/:id', adminControllers.softDeleteAdmin);

export const adminRoute = router;