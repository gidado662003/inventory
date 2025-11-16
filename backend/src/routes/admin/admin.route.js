const express = require("express");
const { adminController, getAdminStats } = require("./admin.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const adminMiddleware = require("../../middleware/admin.middleware");

const adminRouter = express.Router();

// Apply both auth and admin middleware to all admin routes
adminRouter.use(authMiddleware);
adminRouter.use(adminMiddleware);

// Admin-only routes
adminRouter.get("/", adminController);
adminRouter.get("/stats", getAdminStats);

module.exports = adminRouter; 