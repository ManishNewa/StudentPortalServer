export interface RegisterRequest {
    email: string;
    password: string;
    phone?: string;
    role?: string;
    authProvider?: string;
    providerId?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SocialLoginRequest {
    idToken: string;
    accessToken: string;
}

export interface OtpRequest {
    email: string;
    otp: string;
}
