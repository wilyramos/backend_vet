import express from 'express';
import connectDB from './config/db.js';

connectDB();

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');

});

app.listen(4000, () => {
    console.log('Server running on port 4000');
});