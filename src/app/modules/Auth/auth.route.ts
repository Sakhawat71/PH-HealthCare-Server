import { Router } from "express";
import { authControllers } from "./auth.controller";
import auth from "../../middlewares/auth";


const router = Router();


router.post(
    '/login',
    authControllers.loginUser
);

router.post(
    '/refresh-token',
    authControllers.refreshToken
);


export const authRouter = router;