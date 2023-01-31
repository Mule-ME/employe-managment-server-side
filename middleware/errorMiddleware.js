const { APP_NODE_ENV } = require("../constants/index");

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  res.status(statusCode);

  res.json({
    err: err.message,
    stack: APP_NODE_ENV !== "production" ? err.stack : null,
  });
};

module.exports = {
  errorHandler,
};
