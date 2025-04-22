import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";

const router = Router();


router.post(
    '/',
    auth('admin'),
    userController.createAdmin);


export const userRouter = router;
