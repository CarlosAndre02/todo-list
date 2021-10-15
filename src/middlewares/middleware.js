module.exports = {
    globalMiddleware(req, res, next) {
        res.locals.errors = req.flash("errors")
        res.locals.user = req.session.user
        next()
    },
    checkCsrfError(err, req, res, next) {
        if (err) {
          return res.redirect("back")
        }
      
        next()
    },
    csrfMiddleware(req, res, next) {
        res.locals.csrfToken = req.csrfToken()
        next()
    },
    loginRequired(req, res, next) {
        if (!req.session.user) {
          req.flash("errors", "Você precisa fazer login.")
          req.session.save(() => res.redirect("/"))
          return
        }
      
        next()
    }
      
}