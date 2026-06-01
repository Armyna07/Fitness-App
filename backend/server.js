const http = require("http");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const { init } = require("./socket");
const { startStatusJob } = require("./jobs/challengeStatus");
const authRoutes = require("./routes/auth.routes");
const challengeRoutes = require("./routes/challenge.routes");
const userRoutes = require("./routes/user.routes");
const friendChallengeRoutes = require("./routes/friendChallenge.routes");
const globalLbRoutes = require("./routes/globalLeaderboard.routes");

dotenv.config();
connectDB();
startStatusJob();

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/friend-challenges", friendChallengeRoutes);
app.use("/api/leaderboard", globalLbRoutes);

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
init(server);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use((err, req, res, next) => {
  console.error(err);

  if (err.name === "CastError" && err.kind === "ObjectId") {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  res.status(err.statusCode || err.status || 500).json({
    message: err.message || "Server Error",
  });
});