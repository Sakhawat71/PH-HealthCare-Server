import prisma from "../../utils/prisma";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import generateToken from "../../utils/createJWTtoken";
import catchAsync from "../../utils/catchAsync";
import { Request, Response } from "express";


const loginUser = async (payload: any) => {

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
        }
    });
    const isCorrectPassword: boolean = await bcrypt.compare(payload.password, userData.password);
    if (!isCorrectPassword) {
        throw new Error("password incurrect")
    };

    const accessToken = generateToken({
        email: userData.email,
        role: userData.role,
    },
        "verySecret",
        '5m'
    );

    const refreshToken = generateToken({
        email: userData.email,
        role: userData.role,
    },
        "verySecret123",
        '30d'
    );

    return {
        accessToken,
        refreshToken,
        needPasswordChange: userData.needPasswordChange
    };
};


const refreshToken = async (payload : any) => {
    console.log({payload});
};

export const authServices = {
    loginUser,
    refreshToken,
};