const User = require("../models/User");
const bcrypt = require("bcrypt");
const { z } = require("zod");

// Define a zod schema for user registration
const userSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
});

const handleNewUser = async (req, res) => {
  let { first_name, last_name, email, password } = req.body;

  // Validate user input using the Zod schema
  const validation = userSchema.safeParse({
    first_name,
    last_name,
    email,
    password,
  });

  if (!validation.success) {
    // Return validation errors if input is invalid
    const errors = validation.error.errors.map((err) => err.message);
    return res.status(400).json({ message: errors });
  }

  // Everything in lower case
  first_name = first_name.toLowerCase();
  last_name = last_name.toLowerCase();
  email = email.toLowerCase();

  // Check for duplicate email in db
  const duplicate = await User.findOne({ where: { email: email } });
  if (duplicate)
    return res.status(409).json({ message: "User already exists" }); // Conflict 409

  try {
    // Encrypt the password
    const hashedPwd = await bcrypt.hash(password, 12);
    // Create and store the new user
    const result = await User.create({
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: hashedPwd,
    });
    console.log(result);
    res.status(201).json({ message: `New user ${first_name} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
