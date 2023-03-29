const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Datenbankverbindung erstellen
const db = mysql.createConnection({
    host: db_connection.env.DB_HOST,
    user: db_connection.env.DB_USER,
    password: db_connection.env.DB_PASSWORD,
    database: db_connection.env.DB_NAME
});

db.connect((err) => {
    if (err) throw err;
    console.log('MySQL connected');
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
        db.query(query, [username, hashedPassword], (err,result) => {
            if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Server error, please try again.' });
            }
            res.status(201).json({ message: 'User registered successfully.' });
            });
            } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error, please try again.' });
            }
            });
            
            app.post('/login', (req, res) => {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ error: 'Username and password are required.' });
            }
            
            const query = 'SELECT * FROM users WHERE username = ?';
            db.query(query, [username], async (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Server error, please try again.' });
                }
            
                if (results.length === 0) {
                    return res.status(401).json({ error: 'Invalid username or password.' });
                }
            
                const user = results[0];
                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    return res.status(401).json({ error: 'Invalid username or password.' });
                }
            
                res.status(200).json({ message: 'Login successful', user: { id: user.id, username: user.username } });
            });
        });

        app.listen(3000, () => {
            console.log('Server is running on port 3000');
            });