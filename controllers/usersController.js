const User = require("../models/User");
const bcrypt = require("bcrypt");

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = async (req, res) => {
  // Get all users from mySQL
  const users = await User.findAll({
    attributes: { exclude: ["password"] },
    raw: true,
  });

  // If no users
  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }

  res.json(users);
};

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = async (req, res) => {
  const { first_name, last_name, password, email } = req.body;

  // Confirm data
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for duplicate username
  const duplicate = await User.findOne({
    where: sequelize.where(
      sequelize.fn("LOWER", sequelize.col("email")), // Convert both username and search to lowercase
      username.toLowerCase()
    ),
    raw: true,
  });

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  // Hash password
  const hashedPwd = await bcrypt.hash(password, 12); // salt rounds

  // Create the userObject without handling roles
  const userObject = { email, first_name, last_name, password: hashedPwd };

  // Create and store the new user in the database
  try {
    const user = await User.create(userObject);
    console.log("User created successfully:", user);
  } catch (error) {
    console.error("Error creating user:", error);
  }

  if (user) {
    //created
    res.status(201).json({ message: `New user ${username} created` });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
};

// @desc Update a user
// @route PATCH /users
// @access Private
//const updateUser = async (req, res) => {
//   const { id, username, roles, active, password } = req.body;

//   // Confirm data
//   if (
//     !id ||
//     !username ||
//     !Array.isArray(roles) ||
//     !roles.length ||
//     typeof active !== "boolean"
//   ) {
//     return res
//       .status(400)
//       .json({ message: "All fields except password are required" });
//   }

//   // Does the user exist to update?
//   const user = await User.findById(id).exec();

//   if (!user) {
//     return res.status(400).json({ message: "User not found" });
//   }

//   // Check for duplicate
//   const duplicate = await User.findOne({ username })
//     .collation({ locale: "en", strength: 2 })
//     .lean()
//     .exec();

//   // Allow updates to the original user
//   if (duplicate && duplicate?._id.toString() !== id) {
//     return res.status(409).json({ message: "Duplicate username" });
//   }

//   user.username = username;
//   user.roles = roles;
//   user.active = active;

//   if (password) {
//     // Hash password
//     user.password = await bcrypt.hash(password, 10); // salt rounds
//   }

//   const updatedUser = await user.save();

//   res.json({ message: `${updatedUser.username} updated` });
// };

// // @desc Delete a user
// // @route DELETE /users
// // @access Private
// const deleteUser = async (req, res) => {
//   const { id } = req.body;

//   // Confirm data
//   if (!id) {
//     return res.status(400).json({ message: "User ID Required" });
//   }

//   // Does the user still have assigned notes?
//   const note = await Note.findOne({ user: id }).lean().exec();
//   if (note) {
//     return res.status(400).json({ message: "User has assigned notes" });
//   }

//   // Does the user exist to delete?
//   const user = await User.findById(id).exec();

//   if (!user) {
//     return res.status(400).json({ message: "User not found" });
//   }

//   const result = await user.deleteOne();

//   const reply = `Username ${result.username} with ID ${result._id} deleted`;

//   res.json(reply);
// };

module.exports = {
  getAllUsers,
  createNewUser,
  // updateUser,
  // deleteUser,
};
