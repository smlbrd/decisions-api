const List = require('../models/lists.model');
const Option = require('../models/options.model');

const controller = {
  getListByListId: async (ctx) => {
    const listId = ctx.params.listId;

    try {
      const list = await List.findById({ _id: listId }).populate('options');

      if (!list) {
        ctx.status = 404;
        ctx.body = { error: 'No results!' };
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
  updateListById: async (ctx) => {
    const listId = ctx.params.listId;
    const listInput = ctx.request.body;

    try {
      const updatedList = await List.findByIdAndUpdate(listId, listInput, {
        new: true,
      });
      if (!updatedList) {
        ctx.status = 404;
        ctx.body = { error: 'List not found' };
      } else {
        ctx.status = 200;
        ctx.body = updatedList;
      }
    } catch (err) {
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
    }
  },
  deleteListById: async (ctx) => {
    const listId = ctx.params.listId;
    try {
      const list = await List.findOneAndDelete({ _id: listId });

      if (!list) {
        ctx.status = 404;
        ctx.body = { error: 'List Not Found' };
      } else {
        ctx.status = 204;
      }
    } catch (err) {
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
    }
  },
  deleteOptionById: async (ctx) => {
    const { listId, optionId } = ctx.params;

    try {
      const option = await Option.findOneAndDelete({
        _id: optionId,
        owner: listId,
      });

      if (!option) {
        ctx.status = 404;
        ctx.body = { error: 'Option Not Found' };
      } else {
        ctx.status = 204;
      }
    } catch (err) {
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
    }
  },

  updateOptionById: async (ctx) => {
    const { listId, optionId } = ctx.params;
    const optionInput = ctx.request.body;

    try {
      const updatedOption = await Option.findByIdAndUpdate(
        { _id: optionId, owner: listId },
        optionInput,
        { new: true }
      );

      if (!updatedOption) {
        ctx.status = 404;
        ctx.body = { error: 'Option Not Found' };
      } else {
        ctx.status = 200;
        ctx.body = updatedOption;
      }
    } catch (err) {
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
    }
  },


  addItemToList: async (ctx) => {
    const listId = ctx.params.listId;
    const optionInput = ctx.request.body

    try {
      optionInput.owner = listId;

      const newOption = new Option(optionInput);
      const savedOption = await newOption.save();

      const updatedList = await List.findByIdAndUpdate(listId, { $push: { options: savedOption._id } }, { new: true });

      if (!updatedList) {
        ctx.status = 404;
        ctx.body = { error: 'List Not Found' };
      } else {
        ctx.status = 200;
        ctx.body = updatedList;
      }
    }
    catch (err) {
      ctx.status = 500;
      ctx.body = { error: "Internal server error" };
    }
  }

};

module.exports = controller;
