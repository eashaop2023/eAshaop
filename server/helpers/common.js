class AppError extends Error {
    constructor(message, statusCode = 400, meta = {}) {
        super(message);
        this.statusCode = statusCode;
        this.meta = meta;
    }
}

const ok = (res, data = {}, status = 200) => res.status(status).json(data);

const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

const requireFields = (payload, required = [], options = {}) => {
  const { atLeastOneOf = [] } = options;

  const missing = required.filter((f) =>
    payload[f] === undefined || payload[f] === null || payload[f] === ""
  );
  if (missing.length)
    throw new AppError(`Missing required: ${missing.join(", ")}`, 422, { missing });

  if (atLeastOneOf.length > 0) {
    const hasAny = atLeastOneOf.some(
      (f) => payload[f] !== undefined && payload[f] !== null && payload[f] !== ""
    );
    if (!hasAny)
      throw new AppError(`At least one of [${atLeastOneOf.join(", ")}] is required`, 422, {
        missing: atLeastOneOf,
      });
  }
};


const parsePagination = (req, defaults = { page: 1, limit: 10 }) => {
    const page = Math.max(parseInt(req.query.page || defaults.page, 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || defaults.limit, 10), 1), 100);
    const skip = (page - 1) * limit;
    return { page, limit, skip };
};

const toObjectId = (mongoose, id) => {
    if (mongoose.Types.ObjectId.isValid(id)) return new mongoose.Types.ObjectId(id);
    throw new AppError("Invalid id", 422);
};

module.exports = { AppError, ok, asyncHandler, requireFields, parsePagination, toObjectId };