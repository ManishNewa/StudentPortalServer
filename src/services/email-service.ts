import nodemailer from 'nodemailer';

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

class EmailService {
    // Send email
    async sendEmail(mailOptions: {
        to: string;
        subject: string;
        text: string;
    }) {
        try {
            const options = {
                from: process.env.EMAIL_USER,
                ...mailOptions,
            };
            await transporter.sendMail(options);
            return { message: 'Email sent successfully' };
        } catch (error) {
            throw new Error('Failed to send email');
        }
    }
}

export default new EmailService();
