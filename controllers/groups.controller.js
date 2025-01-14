const Group = require('../models/groups.model');

const groupController = {
  getGroupById: async (ctx) => {
    const groupId = ctx.params.groupId;
    try {
      const group = await Group.findById({ _id: groupId });

      if (!group) {
        ctx.status = 404;
        ctx.body = { error: 'No results!' };
      } else {
        ctx.status = 200;
        ctx.body = group;
      }
    } catch (err) {
      ctx.status = 500;
      ctx.body = err;
    }
  },
  getMembersByGroupId: async (ctx) => {
    const groupId = ctx.params.groupId;

    try {
      const group = await Group.findById(groupId).populate('members');

      if (!group) {
        ctx.status = 404;
        ctx.body = { error: 'No results!' };
      } else {
        ctx.status = 200;
        ctx.body = group.members;
      }
    } catch (err) {
      ctx.status = 500;
      ctx.body = err;
    }
  },
  postGroup: async (ctx) => {
    const newGroup = new Group(ctx.request.body);
    try {
      await newGroup.save();
      ctx.status = 201;
      ctx.body = newGroup;
    } catch (err) {
      console.log(err);
      ctx.status = 500;
      ctx.body = err;
    }
  },
};

module.exports = groupController;
