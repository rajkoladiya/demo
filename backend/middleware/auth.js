const jwt = require("jsonwebtoken");
const constant = require('./../Constant/index')

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]
    const decord = jwt.verify(token, 'secret');
    req.userData = decord;
    next();
  } catch (error) {
    return res.status(200).json({
      message: "Authentication Filed"
    });
  }
};
