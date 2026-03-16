/**
 * Authentication Middleware
 * Validates session tokens on protected API endpoints
 */

import mongoose from "mongoose";

/**
 * Get or create Session model
 * Uses existing model if already defined, creates new one if not
 */
function getSessionModel() {
  try {
    // Try to get existing model
    return mongoose.model("Session");
  } catch (error) {
    // Model doesn't exist yet, create schema and model
    const sessionSchema = new mongoose.Schema(
      {
        token: { type: String, required: true, unique: true, index: true },
        username: { type: String, required: true, index: true },
        deviceFingerprint: { type: String, required: true, index: true },
        ipAddress: String,
        loginTime: { type: Date, default: Date.now },
        expiryTime: Date,
        active: { type: Boolean, default: true },
        lastActivityTime: { type: Date, default: Date.now },
      },
      { timestamps: true },
    );

    return mongoose.model("Session", sessionSchema, "sessions");
  }
}

const Session = getSessionModel();

/**
 * Middleware to validate authentication token
 * Checks if token exists, is active, and hasn't expired
 */
export async function validateToken(req, res, next) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "No authorization token provided",
      });
    }

    // Extract token from "Bearer <token>" format
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization header format",
      });
    }

    // Find session in database
    const session = await Session.findOne({
      token: token,
      active: true,
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // Check if token has expired
    if (session.expiryTime && new Date() > session.expiryTime) {
      // Mark session as inactive
      await Session.updateOne({ _id: session._id }, { active: false });

      return res.status(401).json({
        success: false,
        message: "Token has expired. Please login again.",
      });
    }

    // Update last activity time
    await Session.updateOne(
      { _id: session._id },
      { lastActivityTime: new Date() },
    );

    // Attach session info to request
    req.session = {
      token: token,
      username: session.username,
      deviceFingerprint: session.deviceFingerprint,
      ipAddress: session.ipAddress,
    };

    // Continue to next middleware/endpoint
    next();
  } catch (error) {
    console.error("Token validation error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during token validation",
    });
  }
}

/**
 * Logout endpoint handler - Invalidates the session token
 */
export async function logout(req, res) {
  try {
    const token = req.headers["authorization"]?.slice(7);

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "No token provided",
      });
    }

    // Mark session as inactive
    const result = await Session.updateOne({ token: token }, { active: false });

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    return res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during logout",
    });
  }
}
