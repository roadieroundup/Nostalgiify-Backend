const { response } = require('express');
const { validationResult } = require('express-validator');

const fieldValidator = (req, res = response, next) => {
    const validationRes = validationResult(req);

    // console.log(validationRes.errors[0].msg);

    if (!validationRes.isEmpty()) {
        return res.status(400).json({
            ok: false,
            message: validationRes.errors[0].msg,
        });
    }

    next();
};

module.exports = {
    fieldValidator,
};
