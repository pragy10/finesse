const { auth } = require("../config/firebaseAdmin");

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: Missing or invalid authorization token" });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("[x] Auth verification error:", error.message);
    return res.status(401).json({ error: "Unauthorized: Invalid or expired token", details: error.message });
  }
}

async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split("Bearer ")[1];
      const decodedToken = await auth.verifyIdToken(token);
      req.user = decodedToken;
    }
  } catch (error) {
    console.warn("[!] Optional auth token could not be verified:", error.message);
  }
  next();
}

module.exports = { requireAuth, optionalAuth };
