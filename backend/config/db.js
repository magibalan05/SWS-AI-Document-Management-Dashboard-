const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

let dbInstance = null;

const connectDB = async () => {
  if (dbInstance) return dbInstance;
  
  try {
    const db = await open({
      filename: path.join(__dirname, '../database.sqlite'),
      driver: sqlite3.Database
    });
    
    // Create tables if they don't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT,
        filesize INTEGER,
        filepath TEXT,
        status TEXT DEFAULT 'Completed',
        uploadDate DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message TEXT,
        type TEXT,
        read INTEGER DEFAULT 0,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log("SQLite DB Connected and Tables Created");
    dbInstance = db;
    return db;
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

const getDB = () => dbInstance;

module.exports = { connectDB, getDB };
