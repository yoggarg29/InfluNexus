// Forward rejected async controllers to Express.
function asyncHandler(fn) {
  return function (req, resp, next) {
    Promise.resolve(fn(req, resp, next)).catch(next);
  };
}

function errorHandler(err, req, resp, next) {
  console.error(err);

  // Duplicate email
  if (err.code === "ER_DUP_ENTRY") {
    return resp.status(409).json({ message: "This email is already registered." });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong. Please try again.";
  resp.status(statusCode).json({ message });
}

module.exports = { asyncHandler, errorHandler };
