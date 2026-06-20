module.exports = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (err) {
            console.error("ACTUAL ERROR:", err);
            next(err);
        }
    };
};