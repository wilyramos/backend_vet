import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import veterinarioRoutes from './routes/veterinarioRoutes.js';

connectDB();

const app = express();
app.use(express.json());
dotenv.config();

app.use('/api/veterinarios', veterinarioRoutes);



const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});