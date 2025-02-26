import * as fs from 'fs';
import * as path from 'path';

import EmailConfig from '../config/email';

import {
    registrationEmailContent,
    otpEmailContent,
} from '../templates/email-templates';

class EmailService {
    private emailTemplatePath: string;
    private emailTemplate: string;

    constructor() {
        this.emailTemplatePath = path.resolve(
            __dirname,
            process.env.EMAIL_TEMPLATE_PATH ||
                '../public/main-email-template.html',
        );

        try {
            this.emailTemplate = fs.readFileSync(
                this.emailTemplatePath,
                'utf-8',
            );
        } catch (error) {
            throw new Error(
                `Failed to load email template at ${this.emailTemplatePath}: ${
                    error instanceof Error ? error.message : error
                }`,
            );
        }
    }

    // handle sending email for verifying user
    public handleRegistrationVerification(
        email: string,
        verificationToken: string,
    ) {
        const verificationUrl = `${process.env.API_URL}/api/auth/verify/${verificationToken}`;
        const emailBody: string = registrationEmailContent(verificationUrl);

        return this.sendEmail(
            email,
            'Confirm Your Student Portal Email Address',
            emailBody,
        );
    }

    // handle OTP emails
    public sendOtpEmail(email: string, otpCode: string) {
        return this.sendEmail(
            email,
            'Your Student Portal account OTP',
            otpEmailContent(otpCode),
        );
    }

    // handle replacing email body and sending email
    public async sendEmail(email: string, subject: string, emailBody: string) {
        const emailHtml: string = this.emailTemplate.replace(
            '{{emailBody}}',
            emailBody,
        );
        return await EmailConfig.sendEmail({
            to: email,
            subject,
            html: emailHtml,
        });
    }
}

export default new EmailService();
