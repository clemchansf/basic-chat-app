var request = require("request")

describe("calc", () => {
  it("should multiple 2x2", () => {
    expect(2 * 2).toBe(4)
  })
})

describe("get messages", () => {
  it("should return 200 ok", done => {
    request.get("http://localhost:3000/messages", (err, response) => {
      console.log(response.body)
      expect(response.statusCode == 200).toBe(true)
      done()
    })
  })
  it("should return a list, that's not empty", done => {
    request.get("http://localhost:3000/messages", (err, response) => {
      // console.log(response.body)
      expect(response.body.length).toBeGreaterThan(40)
      done()
    })
  })
})
