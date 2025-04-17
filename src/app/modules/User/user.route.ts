import { Router } from "express";

const router = Router();


router.get('/', (req, res) => {
    res.send({
        message: 'you hit user router...'
    })
});


export const userRouter = router;
