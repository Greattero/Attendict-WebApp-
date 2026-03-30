import express from "express";

import mongoose from "mongoose";

import cors from "cors";

import dotenv from "dotenv";

import { ObjectId } from "mongodb";

import {
  generateDeviceFingerprint,
  generateSessionToken,
  validateFingerprint,
} from "./fingerprint.js";

// TODO: Import auth after Session model is created
// import { validateToken, logout } from './auth.js';

const app = express();

dotenv.config();

const corsOptions = {
  origin: ["http://localhost:5173", "https://attendict.vercel.app"],

  methods: ["GET", "POST", "DELETE", "OPTIONS"],

  allowedHeaders: ["Content-Type", "Authorization"],

  credentials: false,

  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions)); // ✅ Needed

app.options("*", cors(corsOptions)); // Handle preflight requests

app.use(express.json()); // ✅ Needed

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,

  useUnifiedTopology: true,
});

const studentSchema = new mongoose.Schema(
  {
    name: String,

    index_no: String,

    programme: String,

    level: String,

    myip: String, // ✅ add this line

    username: String,

    password: String,

    doubtChecker: String,

    checkedTime: String,

    location: {
      lat: Number,

      lon: Number,
    },
  },
  { timestamps: true },
);

// Sessions Schema - Stores authentication tokens and device fingerprints
const sessionSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    username: {
      type: String,
      required: true,
      index: true,
    },

    deviceFingerprint: {
      type: String,
      required: true,
      index: true,
    },

    ipAddress: String,

    loginTime: {
      type: Date,
      default: Date.now,
    },

    expiryTime: Date,

    checkedIn: {
  type: Boolean,
  default: false
    },

    active: {
      type: Boolean,
      default: true,
    },

    lastActivityTime: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const Session = mongoose.model("Session", sessionSchema, "sessions");

// Middleware to validate authentication token
const validateToken = async (req, res, next) => {
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
    // if (session.expiryTime && new Date() > session.expiryTime) {
    //   // Mark session as inactive
    //   await Session.updateOne({ _id: session._id }, { active: false });

    //   return res.status(401).json({
    //     success: false,
    //     message: "Token has expired. Please login again.",
    //   });
    // }

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
};

// // Define the model once at the top level

// const Student = mongoose.model("Student", studentSchema);

// app.post('/api/host-details', async (req, res) => {

//     try {

//         const programName = req.body.programme;  // Fixed variable name (was using undeclared 'programme')

//         // Create dynamic model if needed

//         const ProgramModel = mongoose.model("Programme", studentSchema, programName);

//         // Save the data

//         await ProgramModel.create(req.body);

//         console.log(programName)

//         res.json({ success: true });

//     } catch (err) {

//         res.status(400).json({ error: err.message });

//     }

// });

app.post("/api/host-details", validateToken, async (req, res) => {
  try {
    const { name, index_no, programme, level, myip, location } = req.body;

    // Check if collection exists first

    const collections = await mongoose.connection.db
      .listCollections({ name: programme })
      .toArray();

    if (collections.length > 0) {
      return res.json({ dbAvailable: true });
    }

    // Create dynamic model if needed

    const Student =
      mongoose.models[programme] ||
      mongoose.model(programme, studentSchema, programme);
    
    const deviceFingerprint = req.session.deviceFingerprint;

    const existingSession = await Session.findOne({
      deviceFingerprint: deviceFingerprint,
      active: true,
    });

    // Save the data

    const newStudent = await Student.create({
      name,

      index_no,

      programme,

      level,

      myip,

      location,

      doubtChecker: "0",

      checkedTime: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    const expiryTime = new Date(Date.now() + 10 * 60 * 1000);

    await Session.updateOne(
         { _id: existingSession._id },
         { $set: { checkedIn: true, expiryTime: expiryTime } }
       );

    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/checkin-details", validateToken, async (req, res) => {
  try {
    const { name, index_no, programme, level, myip, distance } = req.body;

    // Check if collection exists first

    const collections = await mongoose.connection.db
      .listCollections({ name: programme })
      .toArray();

    if (collections.length === 0) {
      return res.json({ dbAvailable: false });
    }

    // Now safely define the model

    const Student =
      mongoose.models[programme] ||
      mongoose.model(programme, studentSchema, programme);

    // const deviceFingerprint = req.session.deviceFingerprint;

    // const existingSession = await Session.findOne({
    //   deviceFingerprint: deviceFingerprint,
    //   active: true,
    // });
    
    // Check if student already exists

    const user = await Student.findOne({ index_no });

    const ipCounter = await Student.countDocuments({ myip });

    if (user) {
      return res.json({ available: true });
    }

    let inspect = "0";
    if (distance > 0.085 && distance <= 0.1) inspect = "1";

    // Save the new student

    const newStudent = await Student.create({
      name,

      index_no,

      programme,

      level,

      myip,

      inspect,

      doubtChecker: ipCounter > 0 || inspect === "1" ? "1" : "0",

      checkedTime: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    // await Session.updateOne(
    //      { _id: existingSession._id },
    //      { $set: { checkedIn: true, expiryTime: expiryTime } }
    //    );    

    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/api/host-location", async (req, res) => {
  try {
    const { programme } = req.query;

    if (!programme) {
      return res.status(400).json({ error: "Programme is required" });
    }

    // ✅ CHECK IF COLLECTION EXISTS FIRST
    const collections = await mongoose.connection.db
      .listCollections({ name: programme })
      .toArray();

    // ❌ Course code does not exist in DB
    if (collections.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    const Student =
      mongoose.models[programme] ||
      mongoose.model(programme, studentSchema, programme);

    const host = await Student.findOne();

    if (!host || !host.location) {
      return res.status(404).json({ error: "Host not found" });
    }

    res.json({ location: host.location });
  } catch (err) {
    console.error(err);

    res.status(500).json({ error: err.message });
  }
});

app.get("/api/student-list", validateToken, async (req, res) => {
  try {
    const { programme } = req.query;

    const Student =
      mongoose.models[programme] ||
      mongoose.model(programme, studentSchema, programme);

    const studentList = await Student.find(
      {},
      { name: 1, index_no: 1, doubtChecker: 1, checkedTime: 1, _id: 0 },
    );

    console.log(programme);

    res.json(studentList);
  } catch (err) {
    console.log(`Getting names error: ${err}`);
  }
});

app.post("/api/login-details", async (req, res) => {
  try {
    const { username, password, deviceData } = req.body;

    // Get client IP address
    const clientIp =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress ||
      req.connection.remoteAddress ||
      "unknown";

    // Validate credentials format
    const usernameChecker = username.replace(/[.\s]/g, "");
    const schoolCode =
      usernameChecker[0] === "S"
        ? usernameChecker.substring(0, 5)
        : usernameChecker.substring(0, 3);
    const departmentalCode = usernameChecker.substring(5, 8);
    const departmentalCodesArray = [
      "002",
      "003",
      "005",
      "007",
      "006",
      "008",
      "010",
      "024",
      "028",
    ];
    const isSpecialUser = schoolCode === "901" || schoolCode === "LEC";

    if (
      !isSpecialUser &&
      (schoolCode !== "SRI41" ||
        !departmentalCodesArray.includes(departmentalCode) ||
        usernameChecker.length !== 13)
    ) {
      console.log("Invalid credentials format");
      return res
        .status(401)
        .json({ success: false, message: "Invalid username format" });
    }

    // Generate device fingerprint from client data
    const deviceFingerprint = generateDeviceFingerprint(
      deviceData || {},
      clientIp,
    );

    if (!deviceFingerprint) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Could not generate device fingerprint",
        });
    }

    // Check for existing active sessions from this device with different user
    const existingSession = await Session.findOne({
      deviceFingerprint: deviceFingerprint,
      active: true,
    });

    if (existingSession) {
      const isExpired = new Date(existingSession.expiryTime) < new Date();
      const isDifferentUser = existingSession.username !== username;
    
      // ❌ Active + not expired + different user → block
      if (!isExpired && isDifferentUser && existingSession.checkedIn) {
        return res.status(409).json({
          success: false,
          message: "Can't login till previous user's token expires",
          existingUsername: existingSession.username,
        });
      }
    
      // ✅ Expired OR different user → deactivate old session
      if (isExpired || isDifferentUser) {
        await Session.updateOne(
          { _id: existingSession._id },
          { $set: { active: false } }
        );
      }
    }
    // If same user logging in again, invalidate old session

    if((existingSession && new Date(existingSession.expiryTime) < new Date()) || 
       (existingSession?.checkedIn === false && existingSession?.username !== username) || 
       !existingSession){
      if ((existingSession && existingSession.username === username) || 
          (existingSession && new Date(existingSession.expiryTime) < new Date())) {
        await Session.updateOne({ _id: existingSession._id }, { active: false });
        await Session.deleteOne({ _id: existingSession._id });
        console.log(`Invalidated old session for ${username}`);
      }
  
      // Create new session token
      const sessionToken = generateSessionToken();
      console.log("Session token generated:", sessionToken ? "YES" : "NO");
  
      // Set expiry time to 10 minutes from now (matching session duration)
      const expiryTime = new Date();
      expiryTime.setMinutes(expiryTime.getMinutes() + 10);
  
      // Save session to database
      const newSession = new Session({
        token: sessionToken,
        username: username,
        deviceFingerprint: deviceFingerprint,
        ipAddress: clientIp,
        expiryTime: expiryTime,
        active: true,
        checkedIn: false,
      });
  
      const savedSession = await newSession.save();
      console.log(
        `New session created for ${username}, token: ${sessionToken.substring(0, 10)}...`,
      );

    // Return success with token (NOT username/password)
    const response = {
      success: true,
      token: sessionToken,
      message: "Login successful",
      expiresIn: 600000, // 10 minutes in milliseconds
    };
    
    console.log("Login response about to send:", {
      success: response.success,
      hasToken: !!response.token,
    });
    return res.json(response);
}
else {
    // This handles the "Same User, Active Session" case
    const newExpiry = new Date();
    newExpiry.setMinutes(newExpiry.getMinutes() + 10);

    await Session.updateOne(
        { _id: existingSession._id },
        { $set: { expiryTime: newExpiry } }
    );

    // CRITICAL: You must return a response here!
    return res.json({
        success: true,
        token: existingSession.token, // Return the existing token
        message: "Session extended",
        expiresIn: 600000,
    });
}
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: `Server error during login ${error}`,
    });
  }
});

// Logout endpoint - Invalidates session token
app.post("/api/logout", validateToken, async (req, res) => {
  try {
    const token = req.headers["authorization"]?.slice(7);
    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "No token provided" });
    }
   // await Session.updateOne({ token: token }, { active: false });
    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error during logout" });
  }
});

app.delete("/api/delete-collection", async (req, res) => {
  const { collection_name } = req.body;

  if (!collection_name) {
    return res.status(400).json({ message: "No collection found" });
  }

  try {
    const db = await mongoose.connection.collection(collection_name);

    await db.drop();
    delete mongoose.models[collection_name];

    res.status(200).json({ message: `Document saved successfully` });
  } catch (error) {
    if (error.code == 26) {
      return res.status(404).json({ message: `Document does not exist` });
    } else {
      return res.status(500).json({ message: `Error saving document` });
    }
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT,"0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
