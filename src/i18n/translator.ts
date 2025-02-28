import axios from 'axios';

import I18nLanguage from '../interfaces/i18n-language';

const LIBRETRANSLATE_URL =
    process.env.LIBRETRANSLATE_URL || 'http://localhost:5000';
const API_KEY = process.env.LIBRETRANSLATE_API_KEY || '';

export async function getSupportedLanguages(): Promise<I18nLanguage[]> {
    try {
        const response = await axios.get(`${LIBRETRANSLATE_URL}/languages`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch supported languages:', error);
        return [];
    }
}

export async function translateText(
    text: string,
    targetLang: string,
    sourceLang = 'en',
): Promise<string> {
    try {
        const formData = new URLSearchParams();
        formData.append('q', text);
        formData.append('source', sourceLang);
        formData.append('target', targetLang);
        if (API_KEY) formData.append('api_key', API_KEY);

        const response = await axios.post(
            `${LIBRETRANSLATE_URL}/translate`,
            formData,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            },
        );

        return response.data.translatedText;
    } catch (error) {
        console.error(
            `Translation failed for "${text}" to ${targetLang}:`,
            error,
        );
        return `TRANSLATION_ERROR: ${text}`;
    }
}

export function getLanguageName(
    code: string,
    languages: I18nLanguage[],
): string {
    return languages.find((l) => l.code === code)?.name || code;
}
