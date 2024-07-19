const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 3000;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mima1374',
    database: 'pomodoro_app'
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL as ID', connection.threadId);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/settings', (req, res) => {
    connection.query('SELECT * FROM settings LIMIT 1', (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            timerSettings = results[0];
        }
        res.json(timerSettings);
    });
});

app.put('/settings', (req, res) => {
    timerSettings = { ...timerSettings, ...req.body };
    const query = `
        UPDATE settings SET workTime = ?, breakTime = ?, longTime = ?, currentCycle = ?, active = ?, workCount = ? 
        WHERE id = 1
    `;
    const values = [
        timerSettings.workTime,
        timerSettings.breakTime,
        timerSettings.longTime,
        timerSettings.currentCycle,
        timerSettings.active,
        timerSettings.workCount
    ];
    connection.query(query, values, (error) => {
        if (error) throw error;
        res.json(timerSettings);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
