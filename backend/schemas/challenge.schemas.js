const { z } = require("zod");

const createChallengeSchema = z
  .object({
    // ── BASIC INFO ─────────────────────────────
    name: z.string().min(3).max(80),
    description: z.string().max(500).optional().default(""),
    rules: z.string().optional(),

    // ── TYPE ───────────────────────────────────
    type: z.enum(["steps", "workout", "custom"]),
    customMetric: z.string().max(30).optional(),
    customUnit: z.string().max(15).optional(),

    // ── GOAL ───────────────────────────────────
    goalValue: z.number().positive(),
    // goalUnit: z.string().min(1).max(20),

    // ── DATES (coerce to Date) ────────────────
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),

    // ── PARTICIPANTS ───────────────────────────
    maxParticipants: z.number().int().positive().nullable().optional(),

    // ── VISIBILITY ──────────
    visibility: z.enum(["public", "private"]).default("public"),

    // ── CREATION ───────────────────────────────
    createdBy: z.string().optional(),

    allowedUsers: z.array(z.string()).optional(), // ???

    // ── STATUS ------------------
    status: z.enum(["draft", "active", "completed"]).default("draft"),
  })
  .refine(
    (data) => {
      const diffDays =
        (data.endDate.getTime() - data.startDate.getTime()) /
        (1000 * 60 * 60 * 24);

      return diffDays >= 1 && diffDays <= 365;
    },
    {
      message: "Duration must be between 1 and 365 days",
    },
  );

const editChallengeSchema = z.object({
  
  name: z.string().min(3).max(80).optional(),

  description: z.string().max(500).optional(),

  rules: z.string().optional(),

  type: z.enum(['steps', 'workout', 'custom']).optional(),

  customMetric: z.string().max(30).nullable().optional(),

  customUnit: z.string().max(15).nullable().optional(),

  goalValue: z.number().positive().optional(),

  startDate: z.coerce.date().optional(),

  endDate: z.coerce.date().optional(),

  maxParticipants: z.number().int().positive().nullable().optional(),

  visibility: z.enum(['public', 'private']).optional(),

  status: z.enum(['draft', 'active', 'completed']).optional(),

  allowedUsers: z.array(z.string()).optional(),
}).refine(data => {
  if (data.startDate && data.endDate) {
    const diffDays =
      (data.endDate.getTime() - data.startDate.getTime()) /
      (1000 * 60 * 60 * 24);

    return diffDays >= 1 && diffDays <= 365;
  }
  return true;
}, {
  message: 'Duration must be between 1 and 365 days',
});

module.exports = { createChallengeSchema, editChallengeSchema };
