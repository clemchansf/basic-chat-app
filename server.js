var express = require("express")
var bodyParse = require("body-parser")
var app = express()

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
  console.log(req.body)
  if (!Boolean(req.body.target)) {
    messages.push(req.body)
  }
  console.log(messages)
  res.sendStatus(200)
})

var server = app.listen(3000, () => {
  console.log("Server is listening on port", server.address().port)
})
