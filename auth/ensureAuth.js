module.exports = ensureAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
            return next();
    }
    res.clearCookie('bnetToken');
    res.redirect('/');
}