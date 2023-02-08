const jwt = require("jsonwebtoken");

exports.adminIsAuth = async (req, res, next) => {
  let decodedToken;
  try {
    const token = req.get("Authorization").split(" ")[1];
    decodedToken = jwt.verify(token, process.env.SECRET);
  } catch (err) {
    err.statusCode = 403;
    next(err);
  }
  if (!decodedToken) {
    const error = new Error("Authorization faild!");
    error.statusCode = 401;
    next(error);
  }
  if (decodedToken.role === "admin") {
    req.adminId = decodedToken.userId;
    next();
  } else {
    const error = new Error("invalid credentials");
    error.statusCode = 403;
    next(error);
  }
};

exports.callcenterIsAuth = async (req, res, next) => {
  let decodedToken;
  try {
    const token = req.get("Authorization").split(" ")[1];
    decodedToken = jwt.verify(token, process.env.SECRET);
  } catch (err) {
    err.statusCode = 403;
    next(err);
  }
  if (!decodedToken) {
    const error = new Error("Authorization faild!");
    error.statusCode = 401;
    next(error);
  }
  if (decodedToken.role === "callcenter") {
    req.callcenterId = decodedToken.userId;
    next();
  } else {
    const error = new Error("invalid credentials");
    error.statusCode = 403;
    next(error);
  }
};
