import * as fs from 'fs';
import * as path from 'path';

import EmailConfig from '../config/email';

import { registrationEmailContent } from '../templates/email-templates';

class EmailService {
    private emailTemplatePath: string = path.resolve(
        __dirname,
        '../public/main-email-template.html',
    );
    private emailTemplate: string;

    constructor() {
        try {
            this.emailTemplate = fs.readFileSync(
                this.emailTemplatePath,
                'utf-8',
            );
        } catch (error) {
            throw new Error(`Error loading file::${error}`);
        }
    }

    // handle sending email for verifying user
    public async handleRegistrationVerification(
        email: string,
        verificationToken: string,
    ) {
        const verificationUrl = `${process.env.API_URL}/api/auth/verify/${verificationToken}`;
        const emailBody: string = registrationEmailContent(verificationUrl);

        return await this.sendEmail(
            email,
            'Confirm Your Student Portal Email Address',
            emailBody,
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
