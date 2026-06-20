const express = require("express");
const router = express.Router({ mergeParams: true }); 
const v = require('../middlewares/validations/schema.js');


const wrapAsync = require("../utils/wrapAsync.js");


const { createReview, destroyReview } = require("../controllers/review.js");
const { isLoggedIn, isReviewAuthor } = require("../middlewares/middleware.js"); // Agar middlewares hain toh
const validate  = require('../middlewares/validations/validate.js');
const { reviewValidationSchema } = require('../middlewares/validations/schema.js')

router.post("/",
    isLoggedIn, 
    (req, res, next) => {
        validate({ body: reviewValidationSchema });
        next()
    }
    ,wrapAsync(createReview));

router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(destroyReview));

module.exports = router;