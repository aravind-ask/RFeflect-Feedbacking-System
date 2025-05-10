import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import feedbackRoutes from './routes/feedback';
import userRoutes from './routes/user';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI!, {});

app.use('/api/feedback', feedbackRoutes);
app.use('/api/users', userRoutes);

export default app;
