export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
};

export const ERROR_MESSAGES = {
    DEFAULT: 'Something went wrong',
    MISSING_FIELDS: 'Missing required fields',
    INVALID_CREDENTIALS: 'Invalid credentials',
    USER_EXISTS: 'User already exists',
    VERIFICATION_FAILED: 'Verification failed',
    INVALID_TOKEN: 'Invalid verification token',
    SOCIAL_AUTH_FAILED: 'Social authentication failed',
    OTP_EXPIRED: 'OTP has expired',
    OTP_MISMATCH: 'Invalid OTP code',
};

export const SUCCESS_MESSAGES = {
    REGISTER_SUCCESS:
        'User registered successfully. Please check your email to verify your account',
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logged out successfully',
    USER_VERIFIED: 'User verified successfully',
    VERIFICATION_RESENT: 'Verification email resent successfully',
    SOCIAL_LOGIN: (provider: string) => `${provider} login successful`,
    OTP_SENT: 'OTP sent successfully',
    OTP_VERIFIED: 'OTP verified successfully',
};
