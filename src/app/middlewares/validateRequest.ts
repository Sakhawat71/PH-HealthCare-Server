import { NextFunction, Request, Response } from "express";
import { AnyZodObject, z } from "zod";

export const update = z.object({
    body: z.object({
        name: z.string().optional(),
        contactNumber: z.string().optional()
    })
});

const validateReqest = (schema: AnyZodObject) => async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        await schema.parseAsync({
            body: req.body
        })
        next()
    } catch (error) {
        next(error)
    }

};

export default validateReqest;