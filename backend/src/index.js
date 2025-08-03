import dotenv from 'dotenv';
import express from 'express';

import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.route.js';

// configure env
dotenv.config();

// initialize app
const app = express();

// middleware
app.use(express.json());

// routes
app.use('/api/auth', authRoutes);

// start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log('Server started on port ' + PORT);
    connectDB();
});
