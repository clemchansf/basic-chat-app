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
    message
      .save()
      .then(() => {
        console.log("saved")
        return Message.findOne({ message: "badword" })
      })
      .then(censored => {
        if (censored) {
          console.log("censored word found", censored)
          // Message.deleteOne({ _id: censored.id }, err => {
          //   console.log("removed censored word")
          // })
          // since err will go to the catch block, we can remove it here
          return Message.deleteOne({ _id: censored.id })
        }

        // because of the return above in the censored block
        // emit will no longer send to the client to render it
        // on the browser and then re-render later, which makes
        // the process more efficient (one less step)
        io.emit("message", req.body)
        res.sendStatus(200)
      })
      .catch(err => {
        res.sendStatus(500)
        return console.error(err)
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
