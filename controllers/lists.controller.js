const List = require("../models/lists.model");

const controller = {
  getListByListId: async (ctx) => {
    const listId = ctx.params.listId;

    try {
      const list = await List.findById({ _id: listId });

      if (!list) {
        ctx.status = 404;
        ctx.body = { error: "No results!" };
      } else {
        ctx.status = 200;
        ctx.body = list;
      }
    } catch (err) {
      console.log(err);
      ctx.status = 500;
      ctx.body = err;
    }
  },
  postList: async (ctx) => {
    const newList = new List(ctx.request.body);
    try {
      await newList.save();
      ctx.status = 201;
      ctx.body = newList;
    } catch (err) {
      console.log(err);
      ctx.status = 500;
      ctx.body = err;
    }
  },
};

module.exports = controller;
