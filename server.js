const express = require("express");
const dotenv = require("dotenv").config();
const postsRouter = require("./routers/posts");
const adminRouter = require("./routers/admin");
const authRouter = require("./routers/auth");
const errorsFormatterMiddleware = require("./middlewares/errorsFormatter");
const routeNotFoundMiddleware = require("./middlewares/routeNotFound")


const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.send("Benvenuto nel mio blog!");
});


app.use("/posts", postsRouter);

app.use("/", authRouter);

app.use("/admin", adminRouter)

app.use(errorsFormatterMiddleware);

app.use(routeNotFoundMiddleware);

app.listen(process.env.Port || 3000, () => {
    console.log(`App running on port http://localhost:${process.env.PORT}`)
})