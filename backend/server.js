const bcrypt = require("bcrypt");
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

// Connect to MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.log("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL database!");
    }
});

app.get("/", (req, res) => {
    res.send("Nova Digital Solutions Backend Running");
});app.post("/register", (req, res) => {

    const { fullname, email, password } = req.body;

    const sql = 
    "INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)";
bcrypt.hash(password, 10, (err, hash) => {

    db.query(sql, [fullname, email, hash], (err, result) => {

        if (err) {
            return res.status(500).send("Registration failed");
        }

        res.send("Registration successful");

    });

});
});
app.get("/users", (req, res) => {

    const sql = "SELECT id, fullname, email FROM users";

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).send("Database error");
        }

        res.json(result);

    });

});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});app.post("/login", (req, res) => {

    const { email, password } = req.body;

app.post("/login", (req, res) => {

    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], (err, result) => {

        if (result.length === 0) {
            return res.send("Invalid email or password");
        }

        bcrypt.compare(password, result[0].password, (err, match) => {

            if(match){
                res.send("Login successful");
            } else {
                res.send("Invalid email or password");
            }

        });

    });

});

    db.query(sql, [email, password], (err, result) => {

        if (err) {
            return res.status(500).send("Login error");
        }

        if (result.length > 0) {
            res.send("Login successful");
        } else {
            res.send("Invalid email or password");
        }

    });

});
