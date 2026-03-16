/**
 * Device Fingerprinting Module
 * Generates unique device identifiers based on browser/device characteristics
 */

import crypto from "crypto";

/**
 * Generate a device fingerprint hash from user agent and client data
 * @param {Object} clientData - Data from client (userAgent, screenResolution, timezone, language)
 * @param {string} ipAddress - Client IP address
 * @returns {string} - SHA256 hash of device fingerprint
 */
export function generateDeviceFingerprint(clientData, ipAddress) {
  try {
    // Combine multiple device characteristics
    const fingerprintData = {
      userAgent: clientData.userAgent || "unknown",
      screenResolution: clientData.screenResolution || "unknown",
      timezone: clientData.timezone || "unknown",
      language: clientData.language || "unknown",
      platform: clientData.platform || "unknown",
      ipAddress: ipAddress || "unknown",
    };

    // Create a string that represents the device
    const fingerprintString = JSON.stringify(fingerprintData);

    // Hash it to create a unique identifier
    const hash = crypto
      .createHash("sha256")
      .update(fingerprintString)
      .digest("hex");

    return hash;
  } catch (error) {
    console.error("Error generating device fingerprint:", error);
    return null;
  }
}

/**
 * Generate a secure random token
 * @returns {string} - Random 32-character token
 */
export function generateSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Validate a device fingerprint matches expected format
 * @param {string} fingerprint - The fingerprint to validate
 * @returns {boolean} - True if valid SHA256 hash format
 */
export function validateFingerprint(fingerprint) {
  // SHA256 produces 64 character hex string
  return typeof fingerprint === "string" && /^[a-f0-9]{64}$/.test(fingerprint);
}
