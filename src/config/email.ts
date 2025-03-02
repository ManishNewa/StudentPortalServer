import nodemailer from 'nodemailer';

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Verify the transporter
if (process.env.NODE_ENV !== 'test') {
    transporter.verify((error) => {
        if (error) {
            console.error('Transporter verification failed:', error);
        } else {
            console.log('Transporter is ready to send emails');
        }
    });
}

class EmailConfig {
    async sendEmail(mailOptions: {
        to: string;
        subject: string;
        html: string;
    }) {
        try {
            const options = {
                from: process.env.EMAIL_USER,
                ...mailOptions,
            };
            await transporter.sendMail(options);
            return { message: 'Email sent successfully' };
        } catch (error: any) {
            throw new Error(`Failed to send email::${error.message}`);
        }
    }
}

export default new EmailConfig();
