import fs from 'fs';
import path from 'path';
import {
    translateText,
    getSupportedLanguages,
    getLanguageName,
} from './translator';
import { I18nLanguage } from '../interfaces/i18n-interface';

const LOCALES_DIR = path.join(__dirname, '../locales');
const SOURCE_LANG = 'en';

// Rate limiter to avoid overwhelming the LibreTranslate server
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function syncAndTranslate() {
    const languages = await getSupportedLanguages();
    const targetLangs = fs
        .readdirSync(LOCALES_DIR)
        .filter(
            (lang) =>
                lang !== SOURCE_LANG &&
                fs.statSync(path.join(LOCALES_DIR, lang)).isDirectory(),
        )
        .filter((lang) => languages.some((l) => l.code === lang));

    console.log(`🌐 Supported target languages: ${targetLangs.join(', ')}`);

    for (const lang of targetLangs) {
        console.log(
            `\n🔁 Processing ${getLanguageName(lang, languages)} (${lang})...`,
        );
        await processLanguage(lang, languages);
    }

    console.log('\n✅ Translation sync completed!');
}

async function processLanguage(targetLang: string, languages: I18nLanguage[]) {
    const sourcePath = path.join(LOCALES_DIR, SOURCE_LANG);
    const namespaces = fs
        .readdirSync(sourcePath)
        .filter((file) => file.endsWith('.json'))
        .map((file) => file.replace('.json', ''));

    for (const ns of namespaces) {
        await processNamespace(targetLang, ns, languages);
        await delay(500); // Rate limiting
    }
}

async function processNamespace(
    targetLang: string,
    namespace: string,
    languages: I18nLanguage[]
) {
    const sourceFile = path.join(LOCALES_DIR, SOURCE_LANG, `${namespace}.json`);
    const targetFile = path.join(LOCALES_DIR, targetLang, `${namespace}.json`);

    const sourceContent = JSON.parse(fs.readFileSync(sourceFile, 'utf-8'));
    let targetContent: any = fs.existsSync(targetFile)
        ? JSON.parse(fs.readFileSync(targetFile, 'utf-8'))
        : {};

    const { translatedCount, totalCount } = await syncAndTranslateObject(
        sourceContent,
        targetContent,
        targetLang,
        languages,
        [namespace],
    );

    fs.writeFileSync(targetFile, JSON.stringify(targetContent, null, 2));
    console.log(
        `  ➤ ${namespace}.json: ${translatedCount}/${totalCount} translations updated`,
    );
}

async function syncAndTranslateObject(
    source: any,
    target: any,
    targetLang: string,
    languages: I18nLanguage[],
    path: string[] = [],
): Promise<{ translatedCount: number; totalCount: number }> {
    let translatedCount = 0;
    let totalCount = 0;

    for (const [key, value] of Object.entries(source)) {
        totalCount++;
        const currentPath = [...path, key];

        if (typeof value === 'object') {
            target[key] = target[key] || {};
            const result = await syncAndTranslateObject(
                value,
                target[key],
                targetLang,
                languages,
                currentPath,
            );
            translatedCount += result.translatedCount;
            continue;
        }

        if (!(key in target) || target[key].startsWith('TRANSLATE_')) {
            try {
                const translation = await translateText(
                    String(value),
                    targetLang,
                    SOURCE_LANG,
                );
                target[key] = translation;
                translatedCount++;
            } catch (error) {
                console.error(
                    `Failed to translate ${currentPath.join('.')}:`,
                    error,
                );
                target[key] = `TRANSLATION_FAILED: ${value}`;
            }
            await delay(250); // Rate limiting between requests
        }
    }

    return { translatedCount, totalCount };
}

syncAndTranslate().catch(console.error);
