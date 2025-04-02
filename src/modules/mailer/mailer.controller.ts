import mailService from "./mailer.service";

export async function sendMail(to: any, subject: any, html: any ){
    try {
        let mailOptions = {
            from: process.env.MAILER,
            to,
            subject,
            html,
        };
        
        await mailService.transporter.sendMail(mailOptions)
        console.log("Email sent to dest: %s", to);
    } catch (mailError) {
        console.error("Error sending mail, %o", mailError);
        throw new Error("Error sending mail");
    }
}