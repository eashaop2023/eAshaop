const express = require('express');
const router = express.Router();
const { authMiddleware } = require("../../middlewares/authMiddleware");

const {
    createOrUpdate, list, getOne,
    reviewDelete, toggleLike, getLikeCount
} = require('../../controllers/reviewAndRatingController/reviewController');

const {
    createOrUpdate: upsertComment, listByReview,
    softDelete: deleteComment, toggleLike: toggleCommentLike
} = require('../../controllers/reviewAndRatingController/commentController');

const { create: reportCreate, updateStatus: reportUpdate,
    list: reportList
} = require('../../controllers/reviewAndRatingController/reportController');

router.post('/reviews', authMiddleware, createOrUpdate);
router.get('/reviews', authMiddleware, list);
router.get('/reviews/:id', authMiddleware, getOne);
router.delete('/reviews/:id', authMiddleware, reviewDelete);
router.post('/reviews/like', authMiddleware, toggleLike);
router.get('/reviews/:id/likes', authMiddleware, getLikeCount);

router.post('/comments', authMiddleware, upsertComment);
router.get('/reviews/:reviewId/comments', authMiddleware, listByReview);
router.delete('/comments/:id', authMiddleware, deleteComment);
router.post('/comments/like', authMiddleware, toggleCommentLike);

router.post('/reports', authMiddleware, reportCreate);
router.patch('/reports/:id/status', authMiddleware, reportUpdate);
router.get('/reports', authMiddleware, reportList);

module.exports = router;
