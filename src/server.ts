import 'module-alias/register';
import dotenv from 'dotenv';

import app from '@/app';

dotenv.config({ path: '/.env' });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
