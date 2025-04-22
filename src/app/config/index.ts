import dotenv from 'dotenv';
import path from 'path';

dotenv.config({path : path.join(process.cwd(), '.env')});

export default {
    env : process.env.NODE_ENV,
    port : process.env.PORT,
    jwt_secret : process.env.JWT_SECRET,
    expiresin : process.env.EXPIRES_IN,
    refresh_token_secret : process.env.REFREST_TOKEN_SECRET,
    refresh_expiresin : process.env.REFREST_TOKEN_EXPIRES_IN,
    
};