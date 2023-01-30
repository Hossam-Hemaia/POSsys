exports.getPosSystem = async (req, res, next) => {
  try {
    res.status(200).render("callCenter/pos", { pageTitle: "POS" });
  } catch (err) {
    const error = new Error(err);
    error.statusCode = 422;
    next(error);
  }
};
