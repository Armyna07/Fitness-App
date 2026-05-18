const { z } = require('zod');
 
const submitLogSchema = z.object({
  value: z.number().positive(),
});
 
module.exports = { submitLogSchema };
