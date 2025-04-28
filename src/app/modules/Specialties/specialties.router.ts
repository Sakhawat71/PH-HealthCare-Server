import { Router } from "express";
import { specialtiesController } from "./specialties.controller";

const router = Router();

router.post(
    '/',
    specialtiesController.insertIntoDB
);

export const SpecialtiesRoutes = router;