const { z } = require('zod');
 
const registerSchema = z.object({
  displayName: z.string().trim()
    .min(2, "Display name must be at least 2 characters")
    .max(50, "Display name cannot exceed 50 characters"),

  username: z.string().trim()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username cannot exceed 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),

  email: z.string().trim().email("Invalid email address"),

  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long"),
});
 
const loginSchema = z.object({
  login: z.string().trim().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),

});
 
module.exports = { registerSchema, loginSchema };
