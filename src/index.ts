import express from "express";
import { config } from "dotenv";

config()

const app = express();

const PORT = process.env.PORT || 4000;

app.get('/', (_, res) => {
    res.send("<h1>Hello Dev!</h1>")
})

app.listen(PORT, () => {
    console.log(`Server is running at port: ${PORT}`);
})

