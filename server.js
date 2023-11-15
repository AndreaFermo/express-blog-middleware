const express = require("express");
const dotenv = require("dotenv").config();
const postsRouter = require("./routers/posts");


const app = express();

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.send("Benvenuto nel mio blog!");
});

app.use(express.urlencoded({ extended: true }));

app.use("/posts", postsRouter);

app.listen(process.env.Port || 3000, () => {
    console.log(`App running on port http://localhost:${process.env.PORT}`)
})