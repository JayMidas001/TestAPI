const express = require ("express")
require("./config/dbConfig")
const port = process.env.port || 1188
const app = express()
const cors = require(`cors`)
const morgan = require("morgan");
const router = require("./routers/userRouter")


app.use(express.json())
app.use(cors({origin:"*"}))
app.use(morgan("dev"))
app.use(`/api/v1`, router)



app.listen(port,()=>{
    console.log("App is currently Up & Running, server is listening to port:", port);
})