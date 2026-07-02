/**
 * Centralized error handler. Expects an Error object (optionally with
 * `statusCode` and `message` properties attached by controllers).
 */
export function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }
  res.status(statusCode).json({ message, stack: process.env.NODE_ENV === "production" ? undefined : err.stack });
}

/**
 * Async wrapper so we don't have to write try/catch in every controller.
 *   export const fn = asyncHandler(async (req, res) => { ... })
 */
export function asyncHandler(fn) {
  return (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);
}

/**
 * Build an Error with a status code attached.
 */
export function createError(message, statusCode = 400) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}
