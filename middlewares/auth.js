const { model } = require("mongoose");

const isLogin = (req, res, next) => {
  if (req.session.user === null || req.session.user === undefined) {
    req.flash("alertMessage", "The session has expired !");
    req.flash("alertStatus", "danger");
    res.redirect("/admin/login");
  } else {
    next();
  }
};

module.exports = isLogin;
