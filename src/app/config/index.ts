import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    jwt_secret: process.env.JWT_SECRET,
    expiresin: process.env.EXPIRES_IN,
    refresh_token_secret: process.env.REFREST_TOKEN_SECRET,
    refresh_expiresin: process.env.REFREST_TOKEN_EXPIRES_IN,
    solt_round: process.env.SALTROUNDS,
    reset_pass_secret: process.env.RESET_PASSWORD_SECRET,
    reset_pass_exp: process.env.RESET_PASSWORD_EXPIRE,
    reset_pass_link: process.env.RESET_PASSWORD_LINK,
    emailSerder: {
        email: process.env.EMAIL,
        app_pass: process.env.APP_PASSWORD,
    },
    cloudinary: {
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET,
    }
};