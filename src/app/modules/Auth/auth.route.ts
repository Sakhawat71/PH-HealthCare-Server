import { Router } from "express";
import { authControllers } from "./auth.controller";


const router = Router();


router.post(
    '/',
    authControllers.loginUser
);


export const authRouter = router;