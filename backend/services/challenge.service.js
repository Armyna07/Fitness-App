const { nanoid }   = require("nanoid");
const Challenge    = require("../models/Challenge");
const Progress     = require("../models/Progress");

// ─── Helpers ────────────────────────────────────────────────────────────────

const getChallengeOrThrow = async (id) => {
  const challenge = await Challenge.findById(id);
  if (!challenge) {
    const e = new Error("Challenge not found");
    e.statusCode = 404;
    throw e;
  }
  return challenge;
};

const generateInviteCode = async () => {
  const code   = nanoid(6).toUpperCase();
  const exists = await Challenge.findOne({ inviteCode: code });
  return exists ? generateInviteCode() : code;
};

// ─── Create ─────────────────────────────────────────────────────────────────

const create = async (data, createdBy) => {
  const code       = await generateInviteCode();
  const inviteLink = `${process.env.CLIENT_ORIGIN}/join/${code}`;

  const duration = Math.ceil(
    (new Date(data.endDate) - new Date(data.startDate)) / (1000 * 60 * 60 * 24)
  );

  // Set status based on startDate — upcoming if future, active if today or past
  const now   = new Date(); now.setUTCHours(0, 0, 0, 0);
  const start = new Date(data.startDate); start.setUTCHours(0, 0, 0, 0);
  const status = start > now ? 'upcoming' : 'active';

  const challenge = await Challenge.create({
    ...data,
    goal: data.goalValue,
    duration,
    status,
    createdBy,
    participants: [createdBy],
    inviteLink,
    inviteCode: code,
    finalLeaderboard: [],
  });

  await Progress.create({ user: createdBy, challenge: challenge._id });
  return {
    challenge: {
      ...challenge.toObject(),
      inviteCode: code,
      inviteLink,
    }
  };
};

// ─── Read ────────────────────────────────────────────────────────────────────

const getAllPublic = async (query = {}) => {
  const filter = { visibility: "public", status: { $ne: "completed" } };
  if (query.search) filter.name = { $regex: query.search, $options: "i" };
  return Challenge.find(filter).sort({ createdAt: -1 }).limit(20);
};

// Return active + upcoming challenges the user is part of (not completed)
const getMine = async (userId) => {
  return Challenge.find({
    participants: userId,
    status: { $in: ["active", "upcoming"] },
  }).sort({ startDate: 1 });
};

const getOne = async (id) => {
  const challenge = await Challenge.findById(id).populate(
    "participants",
    "displayName username avatar"
  );
  if (!challenge) {
    const e = new Error("Challenge not found");
    e.statusCode = 404;
    throw e;
  }
  return challenge;
};

// ─── Edit ────────────────────────────────────────────────────────────────────

const edit = async (id, data, userId) => {
  const challenge = await getChallengeOrThrow(id);

  if (String(challenge.createdBy) !== String(userId)) {
    const e = new Error("Forbidden");
    e.statusCode = 403;
    throw e;
  }

  if (challenge.status === "completed") {
    const e = new Error("Cannot edit a completed challenge");
    e.statusCode = 400;
    throw e;
  }

  Object.assign(challenge, data);
  return challenge.save();
};

// ─── Delete ──────────────────────────────────────────────────────────────────

const remove = async (id, userId) => {
  const challenge = await getChallengeOrThrow(id);

  if (String(challenge.createdBy) !== String(userId)) {
    const e = new Error("Forbidden");
    e.statusCode = 403;
    throw e;
  }

  if (challenge.status === "completed") {
    const e = new Error("Cannot delete a completed challenge");
    e.statusCode = 400;
    throw e;
  }

  await Challenge.findByIdAndDelete(id);
  await Progress.deleteMany({ challenge: id });
};

// ─── Join / Leave ────────────────────────────────────────────────────────────

const joinById = async (challengeId, userId) => {
  const challenge = await getChallengeOrThrow(challengeId);
  return _joinChallenge(challenge, userId);
};

const joinByCode = async (code, userId) => {
  const challenge = await Challenge.findOne({ inviteCode: code.toUpperCase() });
  if (!challenge) {
    const e = new Error("Invalid invite code");
    e.statusCode = 404;
    throw e;
  }
  return _joinChallenge(challenge, userId);
};

const _joinChallenge = async (challenge, userId) => {
  if (challenge.status === "completed") {
    const e = new Error("This challenge has already ended");
    e.statusCode = 400;
    throw e;
  }

  const alreadyIn = challenge.participants.some(
    (p) => String(p) === String(userId)
  );
  if (alreadyIn) {
    const e = new Error("Already a participant");
    e.statusCode = 409;
    throw e;
  }

  if (
    challenge.maxParticipants &&
    challenge.participants.length >= challenge.maxParticipants
  ) {
    const e = new Error("Challenge is full");
    e.statusCode = 400;
    throw e;
  }

  challenge.participants.push(userId);
  await challenge.save();

  await Progress.findOneAndUpdate(
    { user: userId, challenge: challenge._id },
    { $setOnInsert: { user: userId, challenge: challenge._id } },
    { upsert: true, returnDocument: 'after' }
  );

  return challenge;
};

const leave = async (challengeId, userId) => {
  const challenge = await getChallengeOrThrow(challengeId);

  const joined = challenge.participants.some(
    (p) => String(p) === String(userId)
  );
  if (!joined) {
    const e = new Error("Not a participant");
    e.statusCode = 404;
    throw e;
  }

  challenge.participants = challenge.participants.filter(
    (p) => String(p) !== String(userId)
  );
  await challenge.save();
  await Progress.findOneAndDelete({ user: userId, challenge: challengeId });
};

// ─── Exports ─────────────────────────────────────────────────────────────────

module.exports = {
  create,
  getAllPublic,
  getMine,
  getOne,
  edit,
  remove,
  joinById,
  joinByCode,
  leave,
};