import express from "express"
import cors from "cors"


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
    res.json({message: "hello-server"})
})

