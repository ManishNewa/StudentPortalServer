import * as fs from 'fs';
import * as path from 'path';
import 'module-alias/register';

import EmailConfig from '@/config/email';

import {
    registrationEmailContent,
    otpEmailContent,
} from '@/templates/email-templates';

interface TemplateReplacements {
    [key: string]: string;
}

const basePath = path.resolve(__dirname, '..');

class EmailService {
    private emailTemplatePath: string;
    private emailTemplate: string;

    constructor() {
        this.emailTemplatePath = path.resolve(
            __dirname,
            process.env.EMAIL_TEMPLATE_PATH ||
                path.join(basePath, 'public', 'main-email-template.html'),
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

    /**
     * Send email verification link to newly registered users
     * @param email - User's email address
     * @param verificationToken - Verification token from database
     */
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

    /**
     * Send OTP code to user's email
     * @param email - User's email address
     * @param otpCode - One-time password code
     */
    public sendOtpEmail(email: string, otpCode: string) {
        const emailBody = otpEmailContent(otpCode);
        return this.sendEmail(
            email,
            'Your Student Portal account OTP',
            emailBody,
        );
    }

    // handle replacing email body and sending email
    public async sendEmail(email: string, subject: string, emailBody: string) {
        const emailHtml: string = this.replacePlaceholders(this.emailTemplate, {
            emailBody,
        });
        return await EmailConfig.sendEmail({
            to: email,
            subject,
            html: emailHtml,
        });
    }

    private replacePlaceholders(
        template: string,
        replacements: TemplateReplacements,
    ): string {
        return Object.entries(replacements).reduce(
            (acc, [key, value]) =>
                acc.replace(new RegExp(`{{${key}}}`, 'g'), value),
            template,
        );
    }
}

export default new EmailService();
