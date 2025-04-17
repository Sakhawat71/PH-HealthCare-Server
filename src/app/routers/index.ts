import { Router } from "express";
import { userRouter } from "../modules/User/user.route";

const router = Router();

const routersModule = [
    {
        path : '/user',
        route : userRouter
    },
];

routersModule.forEach((r) => {
    router.use(r.path,r.route);
});

export default router;