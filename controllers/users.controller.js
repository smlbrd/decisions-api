const User = require('../models/users.model');

const userController = {
  getUserById: async (ctx) => {
    const userId = ctx.params.userId;

    const user = await User.findById({ _id: userId });

    if (!user) {
      ctx.status = 404;
      ctx.body = { error: 'No results!' };
    } else {
      ctx.status = 200;
      ctx.body = user;
    }
  },
  updateUserById: async (ctx) => {
    const userId = ctx.params.userId;
    const userInput = ctx.request.body;

    const updatedUser = await User.findByIdAndUpdate(userId, userInput, {
      new: true,
    });
    if (!updatedUser) {
      ctx.status = 404;
      ctx.body = { error: 'User not found' };
    } else {
      ctx.status = 200;
      ctx.body = updatedUser;
    }
  },
  getListsByUserId: async (ctx) => {
    const userId = ctx.params.userId;

    try {
      const user = await User.findById(userId).populate('savedLists');

      if (!user) {
        ctx.status = 404;
        ctx.body = { error: 'No results!' };
      } else {
        ctx.status = 200;
        ctx.body = user.savedLists;
      }
    } catch (err) {
      ctx.status = 500;
      ctx.body = err;
    }
  },
  postNewUser: async (ctx) => {
    const newUser = new User(ctx.request.body);
    try {
      await newUser.save();
      ctx.status = 201;
      ctx.body = newUser;
    } catch (err) {
      ctx.status = 500;
      ctx.body = err;
    }
  },
  deleteUser: async (ctx) => {
    const userId = ctx.params.userId;
    console.log(userId, '<<< UserID')
    try {
      const user = await User.findOneAndDelete({ _id: userId });

      if (!user) {
        ctx.status = 404;
        ctx.body = { error: 'User Not Found' };
      } else {
        ctx.status = 204;
      }
    } catch (err) {
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
    }
  }
};

module.exports = userController;
