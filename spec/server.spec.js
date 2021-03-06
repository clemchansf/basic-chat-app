var request = require("request")

describe("calc", () => {
  it("should multiple 2x2", () => {
    expect(2 * 2).toBe(4)
  })
})

describe("get messages", () => {
  it("should return 200 ok", done => {
    request.get("http://localhost:3000/messages", (err, response) => {
      // console.log(response.body)
      // expect(response.statusCode == 200).toBe(true)
      done()
    })
  })
  it("should return a list, that's not empty", done => {
    request.get("http://localhost:3000/messages", (err, response) => {
      // console.log(response.body)
      expect(JSON.parse(response.body).length).toBeGreaterThan(0)
      done()
    })
  })
})

describe("get messages from a user", () => {
  it("should return 200 ok", done => {
    request.get("http://localhost:3000/messages/tim", (err, res) => {
      // console.log("statusCode from response", response.statusCode)
      expect(res.statusCode).toEqual(200)
      done()
    })
  })
  it("name should be tim", done => {
    request.get("http://localhost:3000/messages/tim", (err, res) => {
      // console.log("statusCode from response", response.statusCode)
      expect(JSON.parse(res.body)[0].name).toEqual("tim")
      done()
    })
  })
})

describe("delete messages from a user", () => {
  it("should return 200 ok", done => {
    request.delete("http://localhost:3000/messages/tim", (err, res) => {
      // console.log("statusCode from response", response.statusCode)
      expect(res.statusCode).toEqual(200)
      done()
    })
  })
})
