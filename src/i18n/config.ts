import path from 'path';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import { Request, Response, NextFunction } from 'express';

const localesPath = path.join(__dirname, '../../locales');

i18next
    .use(Backend)
    .use({
        type: 'postProcessor',
        name: 'markdown',
        process: (value: string) => value.replace(/\n/g, '<br/>'),
    })
    .init({
        fallbackLng: 'en',
        preload: ['en', 'es'],
        ns: ['common', 'lang'],
        defaultNS: 'lang',
        backend: {
            loadPath: path.join(localesPath, '{{lng}}/{{ns}}.json'),
        },
        postProcess: ['markdown'],
    });

declare module 'express' {
    interface Request {
        t: (key: string, options?: Record<string, unknown>) => string;
    }
}

export const i18nMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const lng = req.acceptsLanguages([...i18next.languages]) || 'en';
    req.t = i18next.getFixedT(lng.toString());
    next();
};

export default i18next;
