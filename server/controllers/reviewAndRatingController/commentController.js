const Review = require('../../models/reviewModels/Review');
const Comment = require('../../models/reviewModels/Comment');
const User = require('../../models/user');
const { AppError, ok, asyncHandler, requireFields, parsePagination } = require('../../helpers/common')

const createOrUpdate = asyncHandler(async (req, res) => {

  const { reviewId, userId, message, ParentComment } = req.body;
  const { commentId } = req.query;


  requireFields(req.body, ['reviewId', 'userId', 'message']);

  const [review, user] = await Promise.all([Review.findOne({ _id: reviewId, isDeleted: false }), User.findById(userId)]);

  if (!review) throw new AppError('Review not found', 404);
  if (!user) throw new AppError('User not found', 404);

  if (ParentComment) {
    const parent = await Comment.findOne({ _id: ParentComment, isDeleted: false });
    if (!parent) throw new AppError('Parent comment not found', 404);
  }
  if (commentId) {
    const existing = await Comment.findOne({ _id: commentId, isDeleted: false });
    if (!existing) throw new AppError('Comment not found', 404);
    existing.isDeleted = true;
    await existing.save();
    const fresh = await Comment.create({
      review: reviewId,
      user: userId,
      message: message ?? existing.message,
      ParentComment: ParentComment ?? existing.ParentComment,
      createdAt: existing.createdAt,
      __v: Number(existing.__v) + 1,
    });
    return ok(res, { message: 'Comment updated', comment: fresh }, 200);
  }
  const created = await Comment.create({ review: reviewId, user: userId, message, ParentComment: ParentComment || null });
  return ok(res, { message: 'Comment added', comment: created }, 201);
});

const listByReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const { page, limit, skip } = parsePagination(req, { page: 1, limit: 20 });
  const q = { review: reviewId, isDeleted: false };
  const [items, total] = await Promise.all([
    Comment.find(q)
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'full_name profileImage'),
    Comment.countDocuments(q),
  ]);
  const map = new Map();
  items.forEach((c) => map.set(String(c._id),
    { ...c.toObject(), replies: [] }));

  const roots = [];
  items.forEach((c) => {
    const pid = c.ParentComment ? String(c.ParentComment) : null;
    if (!pid) roots.push(map.get(String(c._id)));
    else if (map.has(pid)) map.get(pid).replies.push(map.get(String(c._id)));
    else roots.push(map.get(String(c._id)));
  });
  return ok(res, { data: roots, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

const softDelete = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const comment = await Comment.findOne({ _id: id, isDeleted: false });
  if (!comment) throw new AppError('Comment not found', 404);
  comment.isDeleted = true;
  await comment.save();
  return ok(res, { message: 'Comment deleted' });
});

const toggleLike = asyncHandler(async (req, res) => {

  const { commentId, userId } = req.body;

  requireFields(req.body, ['commentId', 'userId']);

  const comment = await Comment.findOne({ _id: commentId, isDeleted: false });

  if (!comment) throw new AppError('Comment not found', 404);

  const idx = comment.likes.findIndex((u) => String(u) === String(userId));

  if (idx > -1) {
    comment.likes.splice(idx, 1);
    await comment.save();
    return ok(res, { liked: false, likes: comment.likes.length });
  }

  comment.likes.push(userId);
  await comment.save();

  return ok(res, { liked: true, likes: comment.likes.length });
});

module.exports = { createOrUpdate, listByReview, softDelete, toggleLike };