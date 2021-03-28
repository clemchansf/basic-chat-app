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

app.post("/messages", async (req, res) => {
  try {
    if (!Boolean(req.body.target)) {
      var message = new Message(req.body)
      var savedMessage = await message.save()
      console.log("saved")
      var censored = await Message.findOne({ message: "badword" })
      if (censored) {
        console.log("censored word found", censored)
        // Message.deleteOne({ _id: censored.id }, err => {
        //   console.log("removed censored word")
        // })
        // since err will go to the catch block, we can remove it here
        await Message.deleteOne({ _id: censored.id })
      } else {
        io.emit("message", req.body)
      }
      res.sendStatus(200)
    } else {
      res.sendStatus(404)
    }
  } catch (err) {
    res.sendStatus(500)
    return console.error(err)
  } finally {
    // logger.log("message post called")
    // or close connection to database
    console.log("message post called")
  }
})

app.get("/messages/:user", (req, res) => {
  Message.find({}, (err, messages) => {
    res.send(messages)
  })
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
