const express = require('express');
const router = express.Router();
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

router.post('/reviews', createOrUpdate);
router.get('/reviews', list);
router.get('/reviews/:id', getOne);
router.delete('/reviews/:id', reviewDelete);
router.post('/reviews/like', toggleLike);
router.get('/reviews/:id/likes', getLikeCount);

router.post('/comments', upsertComment);
router.get('/reviews/:reviewId/comments', listByReview);
router.delete('/comments/:id', deleteComment);
router.post('/comments/like', toggleCommentLike);

router.post('/reports', reportCreate);
router.patch('/reports/:id/status', reportUpdate);
router.get('/reports', reportList);



module.exports = router;
