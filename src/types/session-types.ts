import 'express-session';

declare module 'express-session' {
    interface SessionData {
        user?: object;
        token?: String;
    }
}
