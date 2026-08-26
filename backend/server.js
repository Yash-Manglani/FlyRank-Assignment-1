import express, { text } from "express"
import cors from "cors"
import swaggerUi from "swagger-ui-express";
import fs from 'fs';

const swaggerDocument = JSON.parse(fs.readFileSync("../openapi.json", "utf-8"));

let taskId = 4;

let tasks = [
  { id: 1, title: 'Buy groceries', done: false },
  { id: 2, title: 'Walk the dog', done: true },
  { id: 3, title: 'Finish Node.js assignment', done: false }
];


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
    res.json(tasks);
})

app.get("/tasks/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id)

    if(!task){
        res.status(404).json({error: `Task ${id} not found`});
    }

    res.json(task);

})


app.post("/tasks", (req, res) => {
    const {title} = req.body;

    if(!title || title.trim() === ''){
        res.status(404).json({error: "Bad Request"})
    }

    let task = {
        id: taskId++,
        title: title,
        done: false
    }

    tasks.push(task)

    res.status(201).json(task);



})


app.put("/tasks/:id", (req, res) => {

    const taskId = parseInt(req.params.id);
    const task = tasks.find(t => t.id === taskId);
    if(!task){
        return res.status(404).json({error: "Invalid Id"});
        
    } 
        

    const {title, done} = req.body;

    if (title === undefined && done === undefined) {
        return res.status(400).json({ error: 'Must provide title or done to update' });
    }

    if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }
    task.title = title;
  }


  if (done !== undefined) {
    if (typeof done !== 'boolean') {
      return res.status(400).json({ error: 'done must be a boolean (true/false)' });
    }
    task.done = done;
  }

  res.json(task);
    

});

app.delete("/tasks/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === id);

    if(taskIndex < 0){
        return res.status(404).json({error: "Id not found"});
    }

    tasks.splice(taskIndex, 1);

    res.status(204).send();

});

