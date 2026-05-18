const { nanoid } = require("nanoid");
const Challenge = require("../models/Challenge");
// const { Progress } = require("../models/Progress");
const Progress = require("../models/Progress");

// const Participant = require('../models/Participant');
// const InviteCode = require('../models/InviteCode');
// const { editChallengeSchema } = require('../schemas/challenge.schemas');

const getChallengeOrThrow = async (id) => {
  const challenge = await Challenge.findById(id);
  if (!challenge) {
    const e = new Error("Challenge not found");
    e.statusCode = 404;
    throw e;
  }
  return challenge;
};

const create = async (data, createdBy) => {
  // Generate invite code and URL
  const code = await generateInviteCode();
  const inviteLink = `${process.env.CLIENT_ORIGIN}/join/${code}`;

  const challenge = await Challenge.create({
    ...data,
    createdBy,
    participants: [createdBy],
    inviteLink,
    inviteCode: code,
    status: 'draft',
  });
  await Progress.create({ user: createdBy, challenge: challenge._id });

  return { challenge };
};


const generateInviteCode = async () => {
  const code = nanoid(6).toUpperCase();

  const exists = await Challenge.findOne({ inviteCode: code });

  if (!exists) {
    return code;
  }

  return generateInviteCode();
};

const getAllPublic = async (query = {}) => {
  const filter = { visibility: "public", status: { $ne: "completed" } };
  if (query.search) filter.name = { $regex: query.search, $options: "i" };
  return Challenge.find(filter).sort({ createdAt: -1 }).limit(20);
};

const getMine = async (userId) => {
  return Challenge.find({ participants: userId }).sort({ startDate: 1 });
};

const getOne = async (id) => {
  const challenge = await Challenge.findById(id).populate(
    "participants",
    "displayName username avatar",
  );
  if (!challenge) {
    const e = new Error("Challenge not found");
    e.statusCode = 404;
    throw e;
  }
  return challenge;
};

const edit = async (id, data, userId) => {
  const challenge = await getChallengeOrThrow(id);
  if (String(challenge.createdBy) !== String(userId)) {
    const e = new Error("Forbidden");
    e.statusCode = 403;
    throw e;
  }
  // change back to upcoming if model changes
  if (challenge.status !== "draft") {
    const e = new Error("Cannot edit an active or completed challenge");
    e.statusCode = 400;
    throw e;
  }
  Object.assign(challenge, data);
  return challenge.save();
};

const remove = async (id, userId) => {
  const challenge = await getChallengeOrThrow(id);
  if (String(challenge.createdBy) !== String(userId)) {
    const e = new Error("Forbidden");
    e.statusCode = 403;
    throw e;
  }
  // change to upcoming as well
  if (challenge.status !== "draft") {
    const e = new Error("Cannot delete a started challenge");
    e.statusCode = 400;
    throw e;
  }
  await Challenge.findByIdAndDelete(id);
  await Progress.deleteMany({ challenge: id });
};

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
  // change to upcoming too
  if (challenge.status !== "draft") {
    const e = new Error(
      "This challenge has already started, joining is closed",
    );
    e.statusCode = 400;
    throw e;
  }
  const alreadyIn = challenge.participants.some(
    (p) => String(p) === String(userId),
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

  await Progress.create({ user: userId, challenge: challenge._id });
  return challenge;
};

const leave = async (challengeId, userId) => {
  const challenge = await getChallengeOrThrow(challengeId);
  const joined = challenge.participants.some(
    (p) => String(p) === String(userId),
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
