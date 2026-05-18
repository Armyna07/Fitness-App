const { z } = require('zod');
 
const updateProfileSchema = z.object({
  displayName: z.string().min(2).max(50).optional(),
  avatar:      z.string().url().optional().or(z.literal('')),
});
 
module.exports = { updateProfileSchema };
