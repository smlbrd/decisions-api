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
};

module.exports = userController;
