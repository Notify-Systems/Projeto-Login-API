const express = require("express")
const startDB = require("./database/connect")
const app = express()
const dotenv = require("dotenv")
dotenv.config()
startDB()
const userRoute = require("./routes/user.route")

app.use(express.json())
app.use(userRoute)

app.listen("8080", ()=> console.log("Sevidor rodando"))