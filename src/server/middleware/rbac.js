const ALLOWED_ROLES = ['BUSINESS', 'LMO', 'GATC', 'ADMIN'];

/**
 * RBAC middleware to enforce role-based access control
 * Usage: requireRole("ADMIN") or requireRole(["ADMIN", "LMO"])
 */
function requireRole(allowedRoles) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Authentication required before checking roles'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to [${roles.join(', ')}]. Current role: '${req.user.role}'`
      });
    }

    next();
  };
}

module.exports = {
  requireRole,
  ALLOWED_ROLES
};
