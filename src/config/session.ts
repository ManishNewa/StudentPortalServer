import session from 'express-session';
import { RedisStore } from 'connect-redis';

import redisClient from '@/config/redis-client';

export const sessionConfig = session({
    store: new RedisStore({ client: redisClient }),
    secret:
        process.env.REDIS_SECRET_KEY ||
        'hV3Gd5vF8cXU4n8GyLVP5Qw1dUz+RzX6ST9cC2ZtGFE=',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
});
