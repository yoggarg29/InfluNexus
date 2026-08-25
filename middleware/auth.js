function requireLogin(req, resp, next) {
  if (!req.session.user) {
    return resp.status(401).json({ message: "Please log in to continue." });
  }
  next();
}

// Restrict an API route to one role.
function requireRole(role) {
  return function (req, resp, next) {
    if (!req.session.user) {
      return resp.status(401).json({ message: "Please log in to continue." });
    }
    if (req.session.user.userType !== role) {
      return resp.status(403).json({ message: "You are not allowed to do that." });
    }
    next();
  };
}

// Redirect unauthenticated page visitors.
function requirePageLogin(req, resp, next) {
  if (!req.session.user) return resp.redirect("/");
  next();
}

function requirePageRole(role) {
  return function (req, resp, next) {
    if (!req.session.user || req.session.user.userType !== role) {
      return resp.redirect("/");
    }
    next();
  };
}

module.exports = { requireLogin, requireRole, requirePageLogin, requirePageRole };
