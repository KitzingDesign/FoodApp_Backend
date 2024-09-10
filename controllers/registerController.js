const User = require("../models/User");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res
      .status(400)
      .json({ message: `Username and password are required` });
  }

  //check for duplicate email in db
  const duplicate = await User.findOne({ where: { email: email } });
  if (duplicate) return res.sendStatus(409); //Conflict 409

  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10);
    //Create and store the new user
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
