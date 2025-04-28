import { NextFunction, Request, Response, Router } from "express";
import { specialtiesController } from "./specialties.controller";
import { fileUploader } from "../../helpers/fileUploader";

const router = Router();

router.post(
    '/',
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data)
        return specialtiesController.insertIntoDB(req, res, next)
    }
);

export const SpecialtiesRoutes = router;