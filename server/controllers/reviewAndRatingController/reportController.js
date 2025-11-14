const Report = require('../../models/reviewModels/Report');
const Review = require('../../models/reviewModels/Review');
const Comment = require('../../models/reviewModels/Comment');
const User = require('../../models/user');
const { AppError, ok, asyncHandler, requireFields, parsePagination } = require('../../helpers/common');

const create = asyncHandler(async (req, res) => {

  const { targetType, targetId, reporter, reason, message } = req.body;

  requireFields(req.body, ['targetType', 'targetId', 'reporter', 'reason']);

  if (!['review', 'comment'].includes(targetType))
    throw new AppError('Invalid targetType', 422);

  const [existsTarget, existsUser] = await Promise.all([
    targetType === 'review'
      ? Review.findOne({ _id: targetId, isDeleted: false })
      : Comment.findOne({ _id: targetId, isDeleted: false }),
    User.findById(reporter),
  ]);

  if (!existsTarget)
    throw new AppError('Target not found', 404);

  if (!existsUser)
    throw new AppError('Reporter not found', 404);

  const doc = await Report.create({ targetType, targetId, reporter, reason, message });

  return ok(res, { message: 'Reported', report: doc }, 201);
});

const updateStatus = asyncHandler(async (req, res) => {

  const { id } = req.params;
  const { status } = req.body;

  if (!['pending', 'reviewed', 'dismissed'].includes(status))
    throw new AppError('Invalid status', 422);

  const doc = await Report.findByIdAndUpdate(id, { status }, { new: true });

  if (!doc) throw new AppError('Report not found', 404);

  return ok(res, { message: 'Status updated', report: doc });
});

const list = asyncHandler(async (req, res) => {

  const { status, targetType } = req.query;

  const { page, limit, skip } = parsePagination(req, { page: 1, limit: 20 });

  const q = {};
  if (status) q.status = status;
  if (targetType) q.targetType = targetType;

  const [items, total] = await Promise.all([
    Report.find(q).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('reporter', 'full_name'),
    Report.countDocuments(q),
  ]);

  return ok(res, {
    data: items,
    pagination: {
      page, limit, total, pages: Math.ceil(total / limit)
    }
  });
});

module.exports = { create, updateStatus, list };