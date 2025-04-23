import prisma from "../../utils/prisma";
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import generateToken from "../../utils/createJWTtoken";
import catchAsync from "../../utils/catchAsync";
import { Request, Response } from "express";
import { UserStatus } from "@prisma/client";
import config from "../../config";
import AppError from "../../errors/appError";
import { StatusCodes } from "http-status-codes";
import emailSerder from "./emailSender";
import resetPasswordHTML from "../../utils/resetPasswordHTML";


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


// reset 
const changePassword = async (user: JwtPayload, payload: any) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
        }
    });

    const isCorrectPassword: boolean = await bcrypt.compare(
        payload.oldPassword,
        userData.password
    );
    if (!isCorrectPassword) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            "password incurrect"
        );
    };

    const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);
    await prisma.user.update({
        where: {
            email: userData.email,
            userStatus: "ACTIVE"
        },
        data: {
            password: hashedPassword,
            needPasswordChange: false,
        }
    })

    return {
        message: "Password change Successfully",
        needPasswordChange: false,
    }
};


// forgotPassword
const forgotPassword = async (payload: { email: string }) => {

    const user = await prisma.user.findUnique({
        where: {
            email : payload.email,
            userStatus : "ACTIVE"
        }
    });
    if(!user){
        throw new AppError(StatusCodes.NOT_FOUND,'User Not Found')
    };


    const resetPasswordToken = generateToken(
        {
            email : user.email,
            role : user.role 
        },
        config.reset_pass_token as string,
        config.reset_pass_exp as string
    );

    const resetPassLink = config.reset_pass_link + `?email=${user.email}&token=${resetPasswordToken}`
    const html = resetPasswordHTML(resetPassLink);
    await emailSerder(
        user.email,
        html
    );
    return resetPassLink
};


const resetPassword = async (payload : any) => {
    return payload
};

export const authServices = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword
};