const express = require("express")
const app = express()
const port = 3001

app.get("/user", async (req, res) => {
    return res.send("Hi user")
})

app.listen(port, () => {
    console.log("server is running on 3001")
})