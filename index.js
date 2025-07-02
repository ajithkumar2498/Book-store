import express from "express"
import cors from "cors"
import appRoutes from "./routes/index.js"
import dotenv from "dotenv"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json());


app.get('/',(req, res)=>{
    res.json ({message: "hii this is book management app"})
})


app.use("/api", appRoutes)

app.listen(process.env.PORT, () =>{
    console.log(`App listening in port ${process.env.PORT}`)
})






