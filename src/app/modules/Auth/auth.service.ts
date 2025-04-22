import prisma from "../../utils/prisma";
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import generateToken from "../../utils/createJWTtoken";
import catchAsync from "../../utils/catchAsync";
import { Request, Response } from "express";
import { UserStatus } from "@prisma/client";
import config from "../../config";


const loginUser = async (payload: any) => {

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            userStatus: UserStatus.ACTIVE
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
        config.jwt_secret as string,
        config.expiresin as string
    );

    const refreshToken = generateToken({
        email: userData.email,
        role: userData.role,
    },
        config.refresh_token_secret as string,
        config.refresh_expiresin as string
    );

    return {
        accessToken,
        refreshToken,
        needPasswordChange: userData.needPasswordChange
    };
};


const refreshToken = async (payload: any) => {
    let decodedData;
    try {
        decodedData = jwt.verify(
            payload,
            config.refresh_token_secret as string
        ) as JwtPayload;

    } catch (error) {
        throw new Error("you are not authorize")
    }

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData?.email,
            userStatus: 'ACTIVE'
        }
    });

    const accessToken = generateToken({
        email: userData.email,
        role: userData.role,
    },
        config.jwt_secret as string,
        config.expiresin as string
    );

    return {
        accessToken,
        needPasswordChange: userData.needPasswordChange
    };

};

export const authServices = {
    loginUser,
    refreshToken,
};