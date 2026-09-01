import express, { text } from "express"
import cors from "cors"
import swaggerUi from "swagger-ui-express";
import fs from 'fs';
import pool from "./db.js";
import { error } from "console";

const swaggerDocument = JSON.parse(fs.readFileSync("../openapi.json", "utf-8"));

const openapiDocument = JSON.parse(
  fs.readFileSync(new URL('../openapi.json', import.meta.url))
);
// or fs.readFileSync('../openapi.json', 'utf8')


const app = express();

const port = 3000;

app.use(express.json());

app.use(cors(
    {
        origin: "*",
    }
))

app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
})

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
    res.json({
        "name": "Task API",
        "version": "1.0",
        "endpoints": ["/tasks"]
    })
})

app.get("/health", (_, res) => {
    res.status(200).json({"status": "ok"})
})

app.get("/tasks", async (_, res) => {
    try {
        const result = await pool.query('SELECT * FROM tasks');
        res.json(result.rows);

    } catch (error) {
        res.status(500).json({error: error.message})
    }
    
})

app.get("/tasks/:id", async (req, res) => {

    try {
        
        const id = req.params.id;
        const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
        if(result.rowCount === 0){
            return res.status(404).json({error: "Task not found"});
        }
        
        res.json(result.rows[0]);
        
    } catch (error) {
        res.status(500).json({error: error.message});        
    }

})


app.post("/tasks", async (req, res) => {

    try {
        
        const {title, done} = req.body;
        
        if (!title || typeof title !== 'string' || title.trim() === '') {
            return res.status(400).json({ error: 'Title is required' });
        }
        if(done !== false && done !== true){
            return res.status(400).json({error: "'Done' should be boolean (true/false)"});
        }
        
        const result = await pool.query('INSERT INTO tasks (title, done) VALUES($1, $2) RETURNING *', [title, false]);
        
        return res.status(201).json(result.rows[0]);
        
    } catch (error) {
        res.status(500).json({error: error.message});   
    }

})


app.put("/tasks/:id", async (req, res) => {

    try {
        
        const id = req.params.id;
        
        const {title, done} = req.body;
        
        if (!title || typeof title !== 'string' || title.trim() === '') {
            return res.status(400).json({ error: 'Title is required' });
        }
        

        const doneVal = Boolean(done);

        if(doneVal !== true && doneVal !== false) return res.json({error: error.message});
        
        const result = await pool.query('UPDATE tasks SET title = $1, done = $2 WHERE id = $3 RETURNING *', [title, doneVal, id]);

        if(result.rowCount === 0){
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json(result.rows[0]);
        
        
    } catch (error) {
       res.status(500).json({error: error.message});  
    }


});

app.delete("/tasks/:id", async (req, res) => {

    try {
        
        const id = req.params.id;
        const result = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
        
        if(result.rowCount === 0){
            res.status(404).json({error: 'Task not found'});
        }
        
        res.status(204).send();
    
    } catch (error) {
        res.status(500).json({error: error.message});  
    }
});

