import express, { text } from "express"
import cors from "cors"
import swaggerUi from "swagger-ui-express";
import fs from 'fs';
import pool from "./db.js";

const swaggerDocument = JSON.parse(fs.readFileSync("../openapi.json", "utf-8"));

let taskId = 4;



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

app.get("/tasks", (_, res) => {
    
    const tasks = db.prepare("SELECT * FROM tasks").all();
    res.json(tasks);
})

app.get("/tasks/:id", (req, res) => {
    const id = req.params.id;
    const task = db.prepare(`SELECT * FROM tasks WHERE id = ?`).get(id);    

    

    if(!task){
        res.status(404).json({error: `Task ${id} not found`});
    }

    res.json(task);

})


app.post("/tasks", (req, res) => {
    const {title} = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: 'Title is required' });
    }

    const info = db.prepare("INSERT INTO tasks (title, done) VALUES (?, ?)").run(title.trim(), 0);

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

