module.exports = function (req, res, next) {
    res.format({
        json: () => {
            res.status(404).json({
                message: "La rotta non esiste!"
            });
        },
        default: () => {
            res.status(404).send("<h1>La rotta non esiste!</h1>");
        }
    })
}

