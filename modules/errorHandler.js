module.exports = {
    dbErrorResponse: function (res, error) {
        res.status(500).send({
            error: error.message
        });
    }
};