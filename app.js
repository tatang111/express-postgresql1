const express = require('express')
const app = express()
const path = require("node:path")
require('dotenv').config()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}))

const userRouter = require("./routes/user.router")
app.use("/", userRouter)

app.use((err, req, res, next) => {
    console.error(`Express error: ${err.stack || err}`)
    res.status(500).send('Something broke!');
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Running on port http://localhost:${PORT}`)
})