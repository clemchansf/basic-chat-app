const dotenv = require("dotenv")
dotenv.config()
var express = require("express")
var bodyParse = require("body-parser")
var app = express()
var http = require("http").Server(app) // from node
var io = require("socket.io")(http)

var mongoose = require("mongoose")
var dbUrl = process.env.CONNECTIONSTRING

var Message = mongoose.model("message", {
  name: String,
  message: String
})

// var messages = [
//   { name: "Tim", message: "Hi" },
//   { name: "Jane", message: "Hello" }
// ]

app.use(express.static(__dirname))
app.use(bodyParse.json())
app.use(bodyParse.urlencoded({ extended: false }))

app.get("/messages", (req, res) => {
  Message.find({}, (err, messages) => {
    res.send(messages)
  })
})

app.post("/messages", (req, res) => {
  // console.log(req.body)
  if (!Boolean(req.body.target)) {
    var message = new Message(req.body)
    message.save(err => {
      if (err) {
        res.sendStatus(500)
      }
      // messages.push(req.body)
      io.emit("message", req.body)
      res.sendStatus(200)
    })
  } else {
    res.sendStatus(404)
  }
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
