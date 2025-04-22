import nodemailer from 'nodemailer';
import config from '../../config';


const emailSerder = async (
    email: string,
    html: string
) => {

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: config.emailSerder.email,
            pass: config.emailSerder.app_pass,
        },
        tls: {
            rejectUnauthorized: false 
        }
    });


    const info = await transporter.sendMail({
        from: '"PH Health Care" <shakhawyat.hs@gmail.com>',
        to: email,
        subject: "Reset Password Link",
        // text: "Hello world?",
        html,
    });

    console.log("Message sent: %s", info.messageId);

};

export default emailSerder;