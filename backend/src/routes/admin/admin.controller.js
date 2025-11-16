const adminController = async (req, res) => {
    try {
        // This route is only accessible by admins
        res.status(200).json({ 
            message: "Admin access granted", 
            user: req.user,
            adminOnly: true 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAdminStats = async (req, res) => {
    try {
        // Example admin-only functionality
        const stats = {
            totalUsers: "Admin can see this",
            systemStatus: "Admin can see this",
            adminOnly: true
        };
        
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    adminController,
    getAdminStats
}; 