const v = require('../../utils/validator');

module.exports.reviewValidationSchema = {
    reviews: v.object({
    rating: v.number().required().min(1).max(5),
    comment: v.string().required()
})
}