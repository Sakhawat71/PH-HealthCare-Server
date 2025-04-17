import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routers';

const app: Application = express();
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send({
        message: "PH Health care server..............."
    })
});

app.use('/api/v1', router);

export default app;