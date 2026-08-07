const routerIndex = require('express').Router()

routerIndex.get("/", (req, res) => {
    res.send("Hello World!")
})

module.exports = routerIndex
