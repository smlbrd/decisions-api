const User = require("./model");

/* 6784d64b844f23ac9810cf21
ctx.params.id*/

const controller = {
  getUserbyId: async (ctx) => {
    const user = await User.findById("6784d64b844f23ac9810cf21");
    if (!user) {
      ctx.status = 404;
      ctx.body = { msg: "User not found" };
      return
    }
    ctx.body = user;
  },
  test: async (ctx) => {
    const user = await User.findOne({name: "testy"});
    if (!user) {
      ctx.status = 404;
      ctx.body = { msg: "User not found" };
      return
    }
    ctx.body = user
    ;
  },

};

module.exports = controller;


