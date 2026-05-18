const { z } = require('zod');
 
const sendFriendChallengeSchema = z.object({
  challengeId: z.string().min(1),
  opponentIds: z.array(z.string().min(1)).min(1).max(10),
});
 
const respondSchema = z.object({
  status: z.enum(['accepted', 'declined']),
});
 
module.exports = { sendFriendChallengeSchema, respondSchema };
