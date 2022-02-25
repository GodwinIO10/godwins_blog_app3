const express = require("express") // configuring our express server in app.js file
const app = express() // making our express app
const cors = require("cors")
const jwt = require("jsonwebtoken") // jwt is the module used to create and validate the token
require("dotenv").config() // reads and extracts contents of dotenv file
const port = process.env.PORT
const jwt_key = process.env.JWT_KEY // jwt_key is the secret key

app.use(cors()) // middleware

app.get("/", (req, res) => {
    // route to confirm server status is healthy
    res.status(200).send({ code: 0, message: "healthy" })
})

app.get("/token", (req, res) => {
    // route to generate a token to send to a logged in user /client side
    var id = Math.random().toString(36).substring(2, 8) // creating a random user id
    var limit = 60 * 3 // 180 seconds
    var mainS = Math.floor(Date.now() / 1000) // at this instant, ie this very second === 0 second in value
    var expires = mainS + limit
    var payload = { // putting the random id into the payload object
        _id: id,
        exp: expires // time to expire in seconds
    }
    var token = jwt.sign(payload, jwt_key) // method to create the token. payload is data you're sending back
    res.status(201).send({ code: 0, message: "healthy", data: token })// token (json object) is sent back
}) // token is saved in the browser 

app.get("/test", (req, res) => {
    // route to simulate a valid token for access
    const header = req.header("Authorization") 
    const [type, token] = header.split(" ")// Token is included in this header(Authorization). Type("Bearer") and token are destructured
    if(type === "Bearer" && typeof token !== "undefined"){
        try {
            var payload = jwt.verify(token, jwt_key)
            var current = Math.floor(Date.now() / 1000)
            var diff = payload.exp - current
            res.status(201).send({ code: 0, message: `All is good. ${diff} seconds remaining` })
        } catch (err) {
            res.status(401).send({ code: 654, message: "Invalid or expired token." })
        }

    } else {
        res.status(401).send({ code: 987, message: "Invalid token." })
    }
})

app.listen(port, (err) => {
    if (err) {
        console.log("So sorry, something went wrong!")
        return
    }
    else {
        console.log("Server is running on port.", port)
    }
})