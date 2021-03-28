const dotenv = require("dotenv")
dotenv.config()
var express = require("express")
var bodyParse = require("body-parser")
var app = express()
var http = require("http").Server(app) // from node
var io = require("socket.io")(http)

var mongoose = require("mongoose")
var dbUrl = process.env.CONNECTIONSTRING

var messages = [
  { name: "Tim", message: "Hi" },
  { name: "Jane", message: "Hello" }
]

app.use(express.static(__dirname))
app.use(bodyParse.json())
app.use(bodyParse.urlencoded({ extended: false }))

app.get("/messages", (req, res) => {
  res.send(messages)
})

app.post("/messages", (req, res) => {
  // console.log(req.body)
  if (!Boolean(req.body.target)) {
    messages.push(req.body)
    io.emit("message", req.body)
  }
  console.log(messages)
  res.sendStatus(200)
})

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true }, err => {
  console.log("mongodb connected", err)
})

io.on("connection", socket => {
  console.log("a user connected")
})

var server = http.listen(3000, () => {
  console.log("Server is listening on port", server.address().port)
})
