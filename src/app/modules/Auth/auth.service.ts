import prisma from "../../utils/prisma";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const loginUser = async (payload: any) => {

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
        }
    });

    const isCorrectPassword: boolean = await bcrypt.compare(payload.password, userData.password);

    if (!isCorrectPassword) {
        throw new Error("password incurrect")
    }

    const accessToken = jwt.sign(
        {
            email: userData.email,
            role: userData.role,
        },
        "verySecret",
        {
            algorithm: 'HS256',
            expiresIn: '5m'
        }
    );

    const refreshToken = jwt.sign(
        {
            email: userData.email,
            role: userData.role,
        },
        "verySecret123",
        {
            algorithm: 'HS256',
            expiresIn: '30d'
        }
    );

    return {
        accessToken,
        refreshToken,
        needPasswordChange: userData.needPasswordChange
    }
};



export const authServices = {
    loginUser,
};