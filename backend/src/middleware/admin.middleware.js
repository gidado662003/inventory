const adminMiddleware = async (req, res, next) => {
    try {
        // Check if user exists (should be set by authMiddleware)
        if (!req.user) {
            return res.status(401).json({ message: "Authentication required", auth: false });
        }

        // Check if user has admin role
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Admin access required", auth: false });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: "Server error", auth: false });
    }
}

module.exports = adminMiddleware; 