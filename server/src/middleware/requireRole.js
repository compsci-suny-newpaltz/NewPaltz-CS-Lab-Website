const jwt = require("jsonwebtoken");

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: "No token provided" });

    const token = header.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden: insufficient role" });
      }
      // Attach user info to request object
      req.user = decoded;
      next();

    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
}

module.exports = requireRole;
