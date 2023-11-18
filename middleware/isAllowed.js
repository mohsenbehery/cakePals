module.exports = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.currentUser.role)) {
        return res.status(403).json({ status: 'error', message: 'Access denied. You are not authorized for this action.' });
      }
      next();
    };
  };
  