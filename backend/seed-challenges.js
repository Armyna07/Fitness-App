/**
 * seed-challenges.js — seeds initial public challenges
 * Run with: node seed-challenges.js
 * Safe to re-run — skips challenges that already exist by name
 */

require("dotenv").config();
const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

const Challenge = require("./models/Challenge");
const Progress  = require("./models/Progress");
const User      = require("./models/User");

const MONGO_URI = process.env.MONGO_URI;

const daysFromNow = (n) => {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setDate(d.getDate() + n);
  return d;
};

const generateCode = async () => {
  const code   = nanoid(6).toUpperCase();
  const exists = await Challenge.findOne({ inviteCode: code });
  return exists ? generateCode() : code;
};

const CHALLENGES = [
  {
    name: "10K Steps Daily",
    description: "Walk 10,000 steps every day and build a healthy habit.",
    rules: "Log your steps before midnight UTC each day.",
    type: "steps",
    goal: 10000,
    unit: "steps",
    duration: 30,
    startDate: daysFromNow(0),
    endDate: daysFromNow(30),
    visibility: "public",
    status: "active",
  },
  {
    name: "100 Push-ups a Day",
    description: "Challenge yourself to 100 push-ups every single day.",
    rules: "Log total reps for the day. Can be split into sets.",
    type: "custom",
    customMetric: "push-ups",
    customUnit: "reps",
    goal: 100,
    unit: "reps",
    duration: 14,
    startDate: daysFromNow(0),
    endDate: daysFromNow(14),
    visibility: "public",
    status: "active",
  },
  {
    name: "5KM Run Challenge",
    description: "Run at least 5km every day for 3 weeks.",
    rules: "Log distance in kilometers daily.",
    type: "distance",
    goal: 5,
    unit: "km",
    duration: 21,
    startDate: daysFromNow(0),
    endDate: daysFromNow(21),
    visibility: "public",
    status: "active",
  },
  {
    name: "30-Min Workout Streak",
    description: "Work out for at least 30 minutes every day.",
    rules: "Log minutes spent working out each day.",
    type: "custom",
    customMetric: "workout",
    customUnit: "minutes",
    goal: 30,
    unit: "minutes",
    duration: 30,
    startDate: daysFromNow(0),
    endDate: daysFromNow(30),
    visibility: "public",
    status: "active",
  },
  {
    name: "1.5L Water Daily",
    description: "Stay hydrated — drink at least 1.5 litres of water every day.",
    rules: "Log water intake in millilitres.",
    type: "custom",
    customMetric: "water",
    customUnit: "ml",
    goal: 1500,
    unit: "ml",
    duration: 14,
    startDate: daysFromNow(0),
    endDate: daysFromNow(14),
    visibility: "public",
    status: "active",
  },
];

const seed = async () => {
  await mongoose.connect(MONGO_URI);
  console.log("✅ MongoDB connected\n");

  // Find any existing user to be the creator (uses testuser2 or first user found)
  const creator = await User.findOne({ email: "test@example.com" })
    || await User.findOne();

  if (!creator) {
    console.error("❌ No users found. Register at least one user first, then run this seed.");
    process.exit(1);
  }

  console.log(`👤 Using creator: ${creator.username} (${creator._id})\n`);

  let created = 0;
  let skipped = 0;

  for (const data of CHALLENGES) {
    const exists = await Challenge.findOne({ name: data.name });
    if (exists) {
      console.log(`⏭️  Skipped (already exists): ${data.name}`);
      skipped++;
      continue;
    }

    const code       = await generateCode();
    const inviteLink = `${process.env.CLIENT_ORIGIN}/join/${code}`;

    const challenge = await Challenge.create({
      ...data,
      createdBy:  creator._id,
      participants: [creator._id],
      inviteCode: code,
      inviteLink,
      finalLeaderboard: [],
    });

    // Create progress record for creator
    await Progress.create({
      user:      creator._id,
      challenge: challenge._id,
    });

    console.log(`✅ Created: ${challenge.name} (${challenge._id})`);
    console.log(`   Invite Code: ${code}`);
    created++;
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`🌱 Seed done! ${created} created, ${skipped} skipped.`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
