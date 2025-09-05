import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'Ken14918',
    database: 'booktracker',
    charset: 'utf8mb4',
};

// Create the connection pool
const db = mysql.createPool(dbConfig);

// Test the database for connection 
db.getConnection((err, connection) =>{
    if(err){
        console.error("Error connecting to the database:", err);
     return;
    }
    console.log("Connection to the database was successful!");
    // Release the connection back to the pool
    connection.release();
})

export { db };