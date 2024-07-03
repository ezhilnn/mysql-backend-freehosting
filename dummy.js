const express = require("express");
const mysql = require("mysql");
const app = express();
const cors = require("cors"); 
const path = require('path');
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const con = mysql.createConnection({
    host: 'sql6.freemysqlhosting.net', // New host
    user: 'sql6689423', // New username
    password: 'XY2yT5XW53', // New password
    database: 'sql6689423',
    port: 3306 // New port number
});

app.use(express.urlencoded({ extended: true }));

con.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("connected to the database");

        // Create a table called dummy1
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS dummy1 (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255),
                roolno INT
            )
        `;
        con.query(createTableQuery, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Table 'dummy1' created or already exists");
            }
        });
    }
});

// Endpoint to post data (name and roolno) to dummy1 table
app.post("/data", (req, res) => {
    const { name, roolno } = req.body;
    const insertDataQuery = `INSERT INTO dummy1 (name, roolno) VALUES (?, ?)`;
    con.query(insertDataQuery, [name, roolno], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Failed to insert data" });
        } else {
            console.log("Data inserted successfully");
            res.status(200).json({ message: "Data inserted successfully" });
        }
    });
});

// Endpoint to fetch data from dummy1 table
app.get("/data", (req, res) => {
    const fetchDataQuery = `SELECT * FROM dummy1`;
    con.query(fetchDataQuery, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Failed to fetch data" });
        } else {
            console.log("Data fetched successfully");
            res.status(200).json(result);
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


app.get("/users", (req, res) => {
    const selectUsersQuery = "SELECT * FROM users";
    con.query(selectUsersQuery, (err, result) => {
        if(err) {
            console.log(err);
            res.status(500).json({ error: "Error occurred while fetching users data from database" });
        } else {
            console.log("Users data retrieved successfully");
            res.status(200).json(result); // Send the retrieved data back as JSON response
        }
    });
});