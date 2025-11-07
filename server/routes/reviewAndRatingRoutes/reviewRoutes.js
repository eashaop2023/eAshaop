const express = require('express');
const router = express.Router();
const {
    createAndUpdateReview,
    getReview,
    createAndUpdateComment
} = require('../../controllers/reviewAndRatingController/reviewController');

router.post('/review', createAndUpdateReview);
router.get('/review', getReview)
router.post('/comment', createAndUpdateComment);

module.exports = router;
