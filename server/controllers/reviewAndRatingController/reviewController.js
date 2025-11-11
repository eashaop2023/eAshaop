const mongoose = require("mongoose");
const Doctor = require('../../models/doctorModel')
const User = require('../../models/user')
const Review = require('../../models/reviewModels/Review');
const Comment = require('../../models/reviewModels/Comment')
const Like = require("../../models/reviewModels/Like");
const { AppError, ok, asyncHandler, requireFields, parsePagination, toObjectId } = require("../../helpers/common");

const createOrUpdate = asyncHandler(async (req, res) => {

  const { doctorId, userId, rating, comment } = req.body;

  requireFields(req.body, ["doctorId", "userId"], { atLeastOneOf: ["rating", "comment"] });


  const [doctor, user] = await Promise.all([Doctor.findById(doctorId), User.findById(userId)]);
  if (!doctor) throw new AppError("Doctor not found", 404);
  if (!user) throw new AppError("User not found", 404);

  const existing = await Review.findOne({ doctor: doctorId, user: userId, isDeleted: false });

  if (existing) {
    existing.isDeleted = true;
    await existing.save();
    const fresh = await Review.create({
      doctor: doctorId,
      user: userId,
      rating: rating ?? existing.rating,
      comment: comment ?? existing.comment,
      createdAt: existing.createdAt,
      __v: Number(existing.__v) + 1,
    });

    await Comment.updateMany({ review: existing._id }, { $set: { review: fresh._id } });
    await recalcDoctorAggregates(doctorId);
    return ok(res, { message: "Review updated", review: shapeReview(fresh) }, 200);
  }
  const created = await Review.create({ doctor: doctorId, user: userId, rating, comment });
  await recalcDoctorAggregates(doctorId);
  return ok(res, { message: "Review created", review: shapeReview(created) }, 201);
});

const list = asyncHandler(async (req, res) => {
  const { doctorId, userId } = req.query;
  const { page, limit, skip } = parsePagination(req, { page: 1, limit: 10 });
  const q = { isDeleted: false };
  if (doctorId) q.doctor = doctorId;
  if (userId) q.user = userId;
  const [items, total] = await Promise.all([
    Review.find(q)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("doctor", "name profileImage")
      .populate("user", "full_name profileImage"),
    Review.countDocuments(q),
  ]);
  return ok(res, {
    data: items.map(shapeReview),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

const getOne = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const review = await Review.findOne({ _id: id, isDeleted: false })
    .populate("doctor", "name profileImage")
    .populate("user", "full_name profileImage");
  if (!review) throw new AppError("Review not found", 404);
  return ok(res, shapeReview(review));
});

const reviewDelete = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const review = await Review.findOne({ _id: id, isDeleted: false });
  if (!review) throw new AppError("Review not found", 404);
  review.isDeleted = true;
  await review.save();
  await recalcDoctorAggregates(review.doctor.toString());
  return ok(res, { message: "Review deleted" });
});

const toggleLike = asyncHandler(async (req, res) => {
  const { reviewId, userId } = req.body;
  requireFields(req.body, ["reviewId", "userId"]);
  await ensureReviewExists(reviewId);
  await ensureUserExists(userId);
  const exists = await Like.findOne({ review: reviewId, user: userId });
  if (exists) {
    await Like.deleteOne({ _id: exists._id });
    return ok(res, { liked: false });
  }
  await Like.create({ review: reviewId, user: userId });
  return ok(res, { liked: true });
});

const getLikeCount = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const count = await Like.countDocuments({ review: id });
  return ok(res, { reviewId: id, likes: count });
});

const recalcDoctorAggregates = async (doctorId) => {
  const pipeline = [
    { $match: { doctor: toObjectId(mongoose, doctorId), isDeleted: false } },
    { $group: { _id: "$doctor", avgRating: { $avg: "$rating" }, total: { $sum: 1 } } },
  ];
  const agg = await Review.aggregate(pipeline);
  const avgRating = agg[0]?.avgRating || 0;
  const totalReviews = agg[0]?.total || 0;
  await Doctor.updateOne({ _id: doctorId }, { $set: { avgRating, totalReviews } });
};

const ensureReviewExists = async (id) => {
  const exists = await Review.findOne({ _id: id, isDeleted: false }).select("_id");
  if (!exists) throw new AppError("Review not found", 404);
};
const ensureUserExists = async (id) => {
  const exists = await User.findById(id).select("_id");
  if (!exists) throw new AppError("User not found", 404);
};

const shapeReview = (r) => ({
  _id: r._id,
  doctor: r.doctor,
  user: r.user,
  rating: r.rating,
  comment: r.comment,
  createdAt: r.createdAt,
  updatedAt: r.updatedAt,
});

module.exports = { createOrUpdate, list, getOne, reviewDelete, toggleLike, getLikeCount };