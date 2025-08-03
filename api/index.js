const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const User = require("./models/User.js");
const Booking = require("./models/Booking.js");
const ChatMsg = require("./models/ChatMsg.js");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.js");
const fileRoutes = require("./routes/files.js");
const placesAndBookingRoutes = require("./routes/placesAndBookings.js");
const { authorizeRoles, auth } = require("./middlewares/auth.js");
const http = require("http");
const { Server } = require("socket.io");
const helmet = require("helmet");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT;
const BASE_URL = process.env.BASE_URL;
const MONGO_URL = process.env.MONGO_URL;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT"],
  },
});

app.use(express.json());
app.use(cookieParser());
app.use(helmet.hidePoweredBy());
app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(helmet.hsts({
  maxAge: 31536000,
  includeSubDomains: true,
  preload: true
}));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT"],
  })
);

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("Mongodb connected"))
  .catch((err) => console.log("DB Error:", err));

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("joinRoom", ({ roomId }) => {
    socket.join(roomId);
  });


  socket.on(
    "chat message",
    async ({ roomId, senderId, receiverId, message, user }) => {
      console.log(roomId, senderId, receiverId, message, user);
      const chatMsg = new ChatMsg({
        roomId,
        senderId,
        receiverId,
        message,
        user,
        timestamp: new Date(),
      });
      await chatMsg.save();

      io.to(roomId).emit("chat message", {
        roomId,
        senderId,
        receiverId,
        message,
        user,
        timestamp: chatMsg.timestamp,
      });
    }
  );

  socket.on("disconnect", () => {
    console.log("❌ A user disconnected:", socket.id);
  });
});

app.get("/api/messages/:roomId", async (req, res) => {
  const { roomId } = req.params;
  try {
    const messages = await ChatMsg.find({ roomId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});


app.use("/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api", placesAndBookingRoutes);

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
      if (err) throw err;
      const userDoc = await User.findById(userData.id);
      res.json(userDoc);
    });
  } else {
    res.json({ message: "No User Found" });
  }
});

// app.get('/test-error', (req, res, next) => {
//   const err = new Error('This is a test error');
//   err.status = 400;
//   next(err); 
// });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); 
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});


server.listen(PORT, () => {
  console.log(`Server running on ${BASE_URL}`);
});
