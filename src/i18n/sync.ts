import fs from 'fs';
import path from 'path';

const LOCALES_DIR = path.join(__dirname, '../locales');
const SOURCE_LANG = 'en';

const syncTranslations = () => {
    const sourcePath = path.join(LOCALES_DIR, SOURCE_LANG);
    const targetLangs = fs
        .readdirSync(LOCALES_DIR)
        .filter(
            (lang) =>
                lang !== SOURCE_LANG &&
                fs.statSync(path.join(LOCALES_DIR, lang)).isDirectory(),
        );

    const syncNamespace = (ns: string) => {
        const sourceFile = path.join(sourcePath, `${ns}.json`);
        const sourceContent = JSON.parse(fs.readFileSync(sourceFile, 'utf-8'));

        targetLangs.forEach((lang) => {
            const targetPath = path.join(LOCALES_DIR, lang, `${ns}.json`);
            let targetContent: any = {};

            if (fs.existsSync(targetPath)) {
                targetContent = JSON.parse(
                    fs.readFileSync(targetPath, 'utf-8'),
                );
            }

            const syncKeys = (
                source: any,
                target: any,
                path: string[] = [],
            ): any => {
                Object.keys(source).forEach((key) => {
                    const currentPath = [...path, key];
                    if (typeof source[key] === 'object') {
                        target[key] = target[key] || {};
                        syncKeys(source[key], target[key], currentPath);
                    } else if (!(key in target)) {
                        target[key] = `TRANSLATE_${currentPath.join('.')}`;
                        console.log(
                            `Added ${lang}/${ns}.${currentPath.join('.')}`,
                        );
                    }
                });
                return target;
            };

            const updated = syncKeys(sourceContent, targetContent);
            fs.writeFileSync(targetPath, JSON.stringify(updated, null, 2));
        });
    };

    fs.readdirSync(sourcePath)
        .filter((file) => file.endsWith('.json'))
        .map((file) => file.replace('.json', ''))
        .forEach(syncNamespace);
};

syncTranslations();
console.log('🚀 Synced translations');

function createMissingKeys(source: any, target: any, path: string[] = []) {
    Object.keys(source).forEach((key) => {
        const currentPath = [...path, key];
        if (typeof source[key] === 'object') {
            target[key] = target[key] || {};
            createMissingKeys(source[key], target[key], currentPath);
        } else if (!(key in target)) {
            target[key] = `TRANSLATE_${currentPath.join('.')}`;
            console.log(`Added missing key: ${currentPath.join('.')}`);
        }
    });
}
