import express, { text } from "express"
import cors from "cors"
import swaggerUi from "swagger-ui-express";
import fs from 'fs';
import pool from "./db.js";
import { error } from "console";

const swaggerDocument = JSON.parse(fs.readFileSync("../openapi.json", "utf-8"));




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


app.post("/tasks", (req, res) => {
    const {title} = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: 'Title is required' });
    }

    

    const newTask = {
        id: Number(info.lastInsertRowid),
        title: title.trim(),
        done: 0
    };

    res.json(newTask);

})


app.put("/tasks/:id", (req, res) => {

    const taskId = req.params.id;

    const {title, done} = req.body;

    if (title === undefined && done === undefined) {
        return res.status(400).json({ error: 'Invalid Body' });
    }

    if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Invalid Body' });
    }

    const result = db.prepare("UPDATE tasks SET title = ?, done = ? WHERE id = ?").run(title, done, taskId);

    if(result.changes === 0){
        res.status(404).json({error: "task not found"});
    }

    res.status(200).json({
        id: Number(taskId),
        title,
        done
    });

    
  }


});

app.delete("/tasks/:id", (req, res) => {
    const id = req.params.id;
    const info = db.prepare("DELETE FROM tasks WHERE id = ?").run(id);

    if(info.changes === 0){
        res.status(404).json({error: "task not found"});
    }

    res.status(200).send();
});

