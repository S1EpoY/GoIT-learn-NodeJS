require('dotenv').config();

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = function emailSendler(user) {
    const msg = {
        to: user.email,
        from: 'baryshnikov.serhii@gmail.com',
        subject: 'Confirm Email',
        text: `Hello! Welcome to my website! Your verification code: ${user.otpCode}. You can copy it and enter in the field or follow the link: ${process.env.BASE_URL}auth/otp/${user.otpCode}`,
        html: `<p>
        
        Hello!<br>
        <br>
        Welcome to my website!<br>
        <br>
        Your verification code: ${user.otpCode}<br>
        You can copy it and enter in the field or follow the link:<br>
        <br>
        <a href="${process.env.BASE_URL}auth/otp/${user.otpCode}">Confirm your email address</a>
        
        </p>`
    };

    return sgMail.send(msg);
}