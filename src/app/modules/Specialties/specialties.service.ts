import { Request } from "express";


const insertIntoDB = async (req: Request) => {
    return req.body;
};


export const specialtiesServices = {
    insertIntoDB,
};