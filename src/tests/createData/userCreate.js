const User = require("../../models/User");

const userCreate = async () => {
  const user = {
    firstName: "alejandro",
    lastName: "velosa",
    email: "alejovelosa@gmail.com",
    password: "alejito",
    phone: "3133244768",
  };

  await User.create(user);
};

module.exports = userCreate;
