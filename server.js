const express = require ("express")
require("./config/dbConfig")
const port = process.env.port || 1188
const app = express()
const cors = require(`cors`)
const morgan = require("morgan");
const userRouter = require("./routers/userRouter")
const productRouter = require("./routers/productRouter")
const merchantRouter = require("./routers/merchantRouter")


app.use(express.json())
app.use(cors({origin:"*"}))
app.use(morgan("dev"))
app.use(`/api/v1`, userRouter)
app.use(`/api/v1`, merchantRouter)
app.use(`/api/v1`, productRouter)
app.use('/uploads', express.static('uploads'))

app.listen(port,()=>{
    console.log("App is currently Up & Running, server is listening to port:", port);
})