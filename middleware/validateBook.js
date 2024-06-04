const { Validator } = require('jsonschema');
const bookSchema = require('../schemas/bookSchema.json');

const validateBook = (req, res, next) => {
    const v = new Validator();
    const result = v.validate(req.body, bookSchema);

    if (!result.valid) {
        const errors = result.errors.map(error => error.stack);
        return res.status(400).json({ errors });
    }
    next();
};

module.exports = validateBook;