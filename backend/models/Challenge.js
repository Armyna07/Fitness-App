const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    rules: {
      type: String,
      default: '',
    },

    type: {
      type: String,
      default: 'custom',
    },

    goal: {
      type: Number,
      default: 0,
    },

    unit: {
      type: String,
      default: 'points',
    },

    duration: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ['active', 'upcoming', 'completed'],
      default: 'active',
    },

    startDate: {
      type: Date,
    },

    endDate: {
      type: Date,
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    inviteCode: {
      type: String,
      unique: true,
      sparse: true,
    },

    inviteLink: {
      type: String,
    },

    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },
    finalLeaderboard: [
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rank: Number,
    totalAmount: Number,
  },
],

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Challenge', ChallengeSchema);
