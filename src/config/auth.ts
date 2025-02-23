export const authConfig = {
    jwtSecret: process.env.JWT_SECRET!,
    otpExpiryMinutes: 15,
    social: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
        facebook: {
            clientId: process.env.FACEBOOK_APP_ID!,
            clientSecret: process.env.FACEBOOK_APP_SECRET!,
        },
    },
};
