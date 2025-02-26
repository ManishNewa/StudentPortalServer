import * as fs from 'fs';
import * as path from 'path';

import EmailConfig from '../config/email';

import { registrationEmailContent } from '../templates/email-templates';

class EmailService {
    private emailTemplatePath: string = path.resolve(
        __dirname,
        '../public/main-email-template.html',
    );

    // handle sending email for verifying user
    public async handleRegistrationVerification(
        email: string,
        verificationToken: string,
    ) {
        const verificationUrl = `${process.env.API_URL}/api/auth/verify/${verificationToken}`;
        let emailTemplate: string;
        try {
            emailTemplate = fs.readFileSync(this.emailTemplatePath, 'utf-8');
        } catch (error) {
            throw new Error(`Error loading file::${error}`);
        }
        // Setup email body with email and verification url
        const emailBody: string = registrationEmailContent(verificationUrl);
        const emailHtml: string = emailTemplate.replace(
            '{{emailBody}}',
            emailBody,
        );

        await EmailConfig.sendEmail({
            to: email,
            subject: 'Confirm Your Student Portal Email Address',
            html: emailHtml,
        });
    }
}

export default new EmailService();
