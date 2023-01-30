exports.getUserLogin = async (req, res, next) => {
  try {
    res.status(200).render("auth/login", { pageTitle: "تسجيل الدخول" });
  } catch (err) {
    const error = new Error(err);
    error.statusCode = 422;
    next(error);
  }
};
