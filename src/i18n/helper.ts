import { TranslationKey } from './types';
import i18next from './config';

// Overload for string literal fallback (TypeScript 4.1+)
export function trans<T extends string = string>(
    key: TranslationKey,
    options?: Record<string, unknown>,
): T {
    return i18next.t(key, {
        lng: i18next.language,
        fallbackLng: 'en',
        ...options,
    }) as T;
}
