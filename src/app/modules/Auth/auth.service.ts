import prisma from "../../utils/prisma";


const loginUser = async (payload : any) => {

    const findUser = await prisma.user.findUniqueOrThrow({
        where : {
            email : payload.email,
        }
    });

    

    return payload
};



export const authServices = {
    loginUser,
};