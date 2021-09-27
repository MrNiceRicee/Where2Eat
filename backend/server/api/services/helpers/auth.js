const auth = (req, res, next) => {
  // console.log('header', req.headers.authorization);
  next();
}

module.exports = auth;