import express, { text } from "express"
import cors from "cors"

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

