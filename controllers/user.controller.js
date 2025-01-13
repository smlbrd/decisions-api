const User = require("../models/user.model");

const controller = {
  test: (ctx) => {
    ctx.body = "test success!";
  },
  getUserById: async (ctx) => {
    const userId = ctx.params.userId;
    console.log("Request:", userId);

    try {
      const user = await User.findById({ _id: userId });

      if (!user) {
        ctx.status = 404;
        ctx.body = { error: "No results! :c" };
      } else {
        ctx.status = 200;
        ctx.body = user;
      }
    } catch (err) {
      console.log(err);
      ctx.status = 500;
      ctx.body = err;
    }
  },
  getUsers: async (ctx) => {
    try {
      const users = await User.find();
      ctx.status = 200;
      ctx.body = users;
    } catch (err) {
      console.log("Error:", err);
      ctx.status = 500;
      ctx.body = { err: "oops!" };
    }
  },
};

module.exports = controller;
