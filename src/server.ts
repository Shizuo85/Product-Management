import * as dotenv from 'dotenv';
dotenv.config();
import app from './app';
import connect from './database/mongodb';
import { logger } from './lib/logger';
const PORT = parseInt(process.env.PORT || '10000', 10);

connect(() => {
    app.listen(PORT, '0.0.0.0', () => {
        logger.info(`Server started on port ${PORT}`);
    });
});
