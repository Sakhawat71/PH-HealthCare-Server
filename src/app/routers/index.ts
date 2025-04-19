import { Router } from "express";
import { userRouter } from "../modules/User/user.route";
import { adminRoute } from "../modules/Admin/admin.route";

const router = Router();

const routersModule = [
    {
        path: '/user',
        route: userRouter
    },
    {
        path: '/admin',
        route: adminRoute
    }
];

routersModule.forEach((r) => {
    router.use(r.path, r.route);
});

export default router;