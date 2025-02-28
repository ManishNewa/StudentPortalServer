import axios from 'axios';

import {
    I18nLanguage,
    TranslationResponse,
} from '../interfaces/i18n-interface';

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
        // formData.append('alternatives', '3');
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
        // Commented out for now
        // const allTranslatedTexts = [
        //     ...response.data.translatedText,
        //     ...response.data.alternatives,
        // ];
        // return getBestTranslation(allTranslatedTexts);
        return response.data.translatedText;
    } catch (error) {
        console.error(
            `Translation failed for "${text}" to ${targetLang}:`,
            error,
        );
        return `TRANSLATION_ERROR: ${text}`;
    }
}

/**
 * Get the best translation based on confidence score.
 * @param translatedText The initially translated text.
 * @param alternatives List of alternative translations.
 * @returns The translation with the highest confidence score.
 */
async function getBestTranslation(allTranslatedTexts: string[]) {
    let bestMatch = allTranslatedTexts[0];
    let highestConfidence = 0;

    for (const text of allTranslatedTexts) {
        try {
            const response = await axios.post<TranslationResponse[]>(
                `${LIBRETRANSLATE_URL}/detect`,
                new URLSearchParams({ q: text }).toString(),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                },
            );

            const { confidence } = response.data[0] || { confidence: 0 };

            if (confidence > highestConfidence) {
                highestConfidence = confidence;
                bestMatch = text;
            }
        } catch (error) {
            console.error(`Error checking confidence for "${text}":`, error);
        }
    }

    return bestMatch;
}

export function getLanguageName(
    code: string,
    languages: I18nLanguage[],
): string {
    return languages.find((l) => l.code === code)?.name || code;
}
