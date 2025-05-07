import { Router } from "express";
import { patientControllers } from "./patient.controller";


const router = Router();

router.get(
    '/',
    patientControllers.getAllPatients
);





export const patientRoutes = router;