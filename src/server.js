const express = require("express")
const cors = require("cors")
const startDB = require("./database/connect")
const app = express()
const dotenv = require("dotenv")
dotenv.config()
startDB()
const userRoute = require("./routes/user.route")

app.use(cors())
app.use(express.json())
app.use(userRoute)

app.listen("8080", ()=> console.log("Sevidor rodando"))