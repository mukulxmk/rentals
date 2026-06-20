const AppError = require("../../errors/AppError.js");

const validate = ({
  body,
  query,
  params,
} = {}) => {
  return (req, res, next) => {
    const errors = [];

    if (body) {
      const result = body.parse(req.body);

      if (!result.success) {
        errors.push(
          ...result.errors.map((error) => ({
            location: "body",
            ...error,
          }))
        );
      }
    }

    if (query) {
      const result = query.parse(req.query);

      if (!result.success) {
        errors.push(
          ...result.errors.map((error) => ({
            location: "query",
            ...error,
          }))
        );
      }
    }

    if (params) {
      const result = params.parse(req.params);

      if (!result.success) {
        errors.push(
          ...result.errors.map((error) => ({
            location: "params",
            ...error,
          }))
        );
      }
    }

    if (errors.length) {
      return next(
        new AppError(
          "Validation Failed",
          400,
          errors
        )
      );
    }

    next();
  };
};

module.exports = validate;