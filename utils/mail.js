import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendVerificationEmail(to, code) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Your Login Verification Code',
        text: `Your verification code is: ${code}`, // <-- Fixed string interpolation
    };

    await transporter.sendMail(mailOptions);
}
