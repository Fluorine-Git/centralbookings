const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', async (require, res) => {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS solution');
        res.json({
            status: 'success',
            message: 'Server running and connected to MySQL',
            dbTest: rows[0].solution
        });
    } catch (err) {
        console.error('Database connection error: ', err.message);
        res.status(500).json({
            status: 'error',
            message: 'Database connection failed',
            error: err.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});