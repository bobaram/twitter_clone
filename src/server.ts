import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import sequelize from './models';

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
