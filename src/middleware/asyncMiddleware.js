// Stable express version can handle async callbacks for routes, but the error handling is not as good as in beta (>5.x.x).
// Snippet obtained from: https://stackoverflow.com/a/51545204
const asyncMiddleware = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncMiddleware;
