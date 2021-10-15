const Login = require("../models/LoginModel");

module.exports = {
  index(req, res) {
    if (req.session.user) return res.redirect("/todo");
    res.render("login");
  },
  async register(req, res) {
    try {
      const response = await Login.register({
        email: req.body.email,
        password: req.body.password
      });
      
      const { errors } = response
      if (errors.length > 0) {
        req.flash("errors", errors);
        req.session.save(function () {
          return res.redirect("back");
        });
        return;
      }

      const { user } = response
      req.session.user = user;
      req.session.save(function () {
        res.redirect("/todo");
      });
    } catch (e) {
      console.log(e);
      return res.redirect("back");
    }
  },
  async login(req, res) {
    try {
      const response = await Login.login({
        email: req.body.email,
        password: req.body.password
      })
      
      const { errors } = response
      if (errors.length > 0) {
        req.flash("errors", errors);
        req.session.save(function () {
          return res.redirect("back");
        });
        return;
      }

      const { user } = response
      req.session.user = user;
      req.session.save(function () {
        res.redirect("/todo");
      });
    } catch (e) {
      console.log(e);
      return res.redirect("back");
    }
  },
  logout(req, res) {
    req.session.destroy();
    res.redirect("/");
  },
};
