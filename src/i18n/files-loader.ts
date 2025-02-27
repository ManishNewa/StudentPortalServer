import fs from 'fs';
import path from 'path';

const localesPath = path.resolve(__dirname, '../locales/en');
const files = fs.readdirSync(localesPath);

const translationResources: Record<string, any> = {};

files.forEach((file) => {
    if (file.endsWith('.json')) {
        const key = file.replace('.json', '');
        translationResources[key] = require(path.join(localesPath, file));
    }
});

export default translationResources;
