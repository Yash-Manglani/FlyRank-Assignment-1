import Database from "better-sqlite3";
import dotenv from "dotenv";
import pg from 'pg'
// const {Pool} = require('pg');
dotenv.config();


const {Pool} = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,

});

async function initDB(){
    const client = await pool.connect();
    try {
        
        await client.query(`
            CREATE TABLE IF NOT EXISTS tasks(
            id SERIAL PRIMARY KEY ,
            title TEXT NOT NULL,
            done BOOLEAN DEFAULT FALSE
            );
        `)

        const {rows} = await client.query("SELECT COUNT(*) FROM tasks");

        const count = parseInt(rows[0].count, 10);
        if(count === 0){
            
            await client.query(`
                INSERT INTO tasks (title, done)
                VALUES
                    ('Buy groceries', false),
                    ('Learn PostgreSQL with Node.js', false),
                    ('Build backend API', true);
            `)
            console.log("Database seeded with data");

        }

    } 
    catch (error) {
        console.error("Error initializing POSTGRESQL Database: ", error);
        
    } finally{
        client.release;
    }
}

initDB();


export default pool;