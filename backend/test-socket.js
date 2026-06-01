/**
 * test-socket.js — verifies Socket.io is working
 * Run with: node test-socket.js
 * Make sure your server is running first!
 */

const { io } = require("socket.io-client");

const SERVER_URL = "http://localhost:5000";
const TEST_CHALLENGE_ID = process.argv[2] || "test-challenge-123";

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("🔌 Socket.io Connection Test");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log(`Server:       ${SERVER_URL}`);
console.log(`Challenge ID: ${TEST_CHALLENGE_ID}`);
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

const socket = io(SERVER_URL, {
  transports: ["websocket"],
});

// ── Test 1: Connection ──
socket.on("connect", () => {
  console.log(`✅ TEST 1 PASSED — Connected! Socket ID: ${socket.id}`);

  // ── Test 2: Join a challenge room ──
  console.log(`\n⏳ TEST 2 — Joining challenge room: ${TEST_CHALLENGE_ID}`);
  socket.emit("join-challenge", TEST_CHALLENGE_ID);
  console.log(`✅ TEST 2 PASSED — Emitted 'join-challenge' event`);

  // ── Test 3: Leave a challenge room ──
  console.log(`\n⏳ TEST 3 — Leaving challenge room: ${TEST_CHALLENGE_ID}`);
  socket.emit("leave-challenge", TEST_CHALLENGE_ID);
  console.log(`✅ TEST 3 PASSED — Emitted 'leave-challenge' event`);

  // ── Test 4: Disconnect ──
  console.log(`\n⏳ TEST 4 — Disconnecting...`);
  socket.disconnect();
});

socket.on("disconnect", (reason) => {
  console.log(`✅ TEST 4 PASSED — Disconnected! Reason: ${reason}`);
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🎉 All socket tests passed!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  process.exit(0);
});

socket.on("connect_error", (err) => {
  console.error(`❌ CONNECTION FAILED — ${err.message}`);
  console.error("Make sure your server is running on port 5000!");
  process.exit(1);
});

// Timeout if nothing happens
setTimeout(() => {
  console.error("❌ TIMEOUT — No response from server after 5 seconds");
  console.error("Make sure your server is running on port 5000!");
  process.exit(1);
}, 5000);
