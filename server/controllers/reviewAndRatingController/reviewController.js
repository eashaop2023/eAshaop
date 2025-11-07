const Doctor = require('../../models/doctorModel')
const User = require('../../models/user')
const Review = require('../../models/reviewModels/Review');
const Comment = require('../../models/reviewModels/Comment')

const createAndUpdateReview = async (req, res) => {
  try {
    const { doctorId, userId, rating, comment } = req.body;
    const { reviewId } = req.query;

    const [doctorExists, userExists] = await Promise.all([
      Doctor.findById(doctorId),
      User.findById(userId)
    ]);

    if (!doctorExists) return res.status(404).json({ message: 'Doctor not found' });
    if (!userExists) return res.status(404).json({ message: 'User not found' });

    const updateFields = {};
    if (rating !== undefined) updateFields.rating = rating;
    if (comment !== undefined) updateFields.comment = comment;

    const existingReview = reviewId
      ? await Review.findOne({ _id: reviewId, isDeleted: false })
      : await Review.findOne({ doctor: doctorId, user: userId, isDeleted: false });

    if (existingReview) {
      existingReview.isDeleted = true;
      await existingReview.save();

      const newReview = await Review.create({
        doctor: doctorId,
        user: userId,
        rating: updateFields.rating || existingReview.rating,
        comment: updateFields.comment || existingReview.comment,
        createdAt: existingReview.createdAt,
        __v: Number(existingReview.__v) + 1
      });

      await Comment.updateMany(
        { review: existingReview._id },
        { $set: { review: newReview._id } }
      );

      return res.status(200).json({
        message: 'Review updated successfully.',
        newReview: {
          _id: newReview._id, doctor: newReview.doctor, user: newReview.user,
          rating: newReview.rating, comment: newReview.comment, createdAt: newReview.createdAt,
          updatedAt: newReview.updatedAt
        }
      });
    }

    const newReview = await Review.create({
      doctor: doctorId,
      user: userId,
      ...updateFields
    });

    return res.status(201).json({
      message: 'Review created successfully.',
      newReview: {
        _id: newReview._id, doctor: newReview.doctor, user: newReview.user,
        rating: newReview.rating, comment: newReview.comment, createdAt: newReview.createdAt,
        updatedAt: newReview.updatedAt
      }
    });

  } catch (err) {
    console.error('Server Error:', err);
    return res.status(500).json({ message: `${err.message} server error` });
  }
};


const getReview = async (req, res) => {
  try {

    const { reviewId, doctorId } = req.query;

    if (!reviewId && !doctorId) {
      return res.status(400).json({ message: 'reviewId or doctorId is required' })
    }

    let query = { isDeleted: false }
    if (reviewId) query._id = reviewId;
    else if (doctorId) query.doctor = doctorId

    const review = await Review.find(query)
      .populate('doctor', 'name profileImage')
      .populate('user', 'full_name profileImage');

    if (!review.length) {
      return res.status(404).json({ message: 'Review not found' });
    }
    return res.status(200).json(review);

  } catch (err) {
    console.log('Error: ', err);
    res.status(500).json({ message: 'server error', err })
  }

}

const createAndUpdateComment = async (req, res) => {
  try {
    const { reviewId, userId, message, ParentComment } = req.body;
    const { commentId } = req.query;

    if (!reviewId || !userId || !message) {
      return res.status(400).json({ message: 'reviewId, userId, and message are required' });
    }

    const [reviewExists, userExists] = await Promise.all([
      Review.findById(reviewId),
      User.findById(userId)
    ]);

    if (!reviewExists) return res.status(404).json({ message: 'review not found' });
    if (!userExists) return res.status(404).json({ message: 'user not found' });

    if (ParentComment) {
      const parentComment = await Comment.findById(ParentComment);
      if (!parentComment) return res.status(404).json({ message: 'Parent comment not found' });
    }

    const existingComment = commentId
      ? await Comment.findOne({ _id: commentId, isDeleted: false })
      : null;

    if (existingComment) {
      existingComment.isDeleted = true;
      await existingComment.save();

      const newComment = await Comment.create({
        review: reviewId,
        user: userId,
        message: message || existingComment.message,
        ParentComment: ParentComment || existingComment.ParentComment,
        createdAt: existingComment.createdAt,
        __v: Number(existingComment.__v) + 1
      });

      return res.status(200).json({
        message: 'Comment updated successfully',
        comment: newComment
      });
    }

    const newComment = await Comment.create({
      review: reviewId,
      user: userId,
      message,
      ParentComment: ParentComment || null
    });

    return res.status(201).json({
      message: 'Comment added successfully',
      comment: newComment
    });

  } catch (err) {
    console.error('Server Error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  createAndUpdateReview,
  getReview,
  createAndUpdateComment,
}