const Group = require('../models/groups.model');

const groupController = {
  getGroupById: async (ctx) => {
    const groupId = ctx.params.groupId;
    try {
      const group = await Group.findById({ _id: groupId });

      if (!group) {
        console.log;
        ctx.status = 404;
        ctx.body = { error: 'No results!' };
      } else {
        ctx.status = 200;
        ctx.body = group;
      }
    } catch (err) {
      console.log(err);
      ctx.status = 500;
      ctx.body = err;
    }
  },
  getGroupsByUserId: async (ctx) => {
    const userId = ctx.params.user_id;
    try {
      const groups = await Group.find({ members: { $in: [userId] } }).populate(
        'members'
      );
      ctx.status = 200;
      ctx.body = groups;
    } catch (err) {
      console.log(err);
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
      ctx.status = 500;
      ctx.body = err;
    }
  },
  editGroupById: async (ctx) => {
    const groupId = ctx.params.groupId;
    const updatedField = ctx.request.body;

    try {
      const updatedGroup = await Group.findByIdAndUpdate(
        groupId,
        updatedField,
        {
          new: true,
        }
      );
      if (!updatedGroup) {
        ctx.status = 404;
        ctx.body = { error: 'Put unsuccessful' };
      } else {
        ctx.status = 200;
        ctx.body = updatedGroup;
      }
    } catch (err) {
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
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
  deleteGroupById: async (ctx) => {
    const groupId = ctx.params.groupId;

    try {
      const group = await Group.findOneAndDelete({ _id: groupId });

      if (!group) {
        ctx.status = 404;
        ctx.body = { error: 'Group Not Found' };
      } else {
        ctx.status = 204;
      }
    } catch (err) {
      ctx.status = 500;
      ctx.body = err;
    }
  },
  removeUserByIdFromGroupById: async (ctx) => {
    const groupId = ctx.params.groupId;
    const userId = ctx.params.userId;
  
    try {
      const group = await Group.findById(groupId);
      if (!group) {
        ctx.status = 404;
        ctx.body = { error: 'Group Not Found' };
        return;
      }
      const user = group.members.some(
        member => member._id.toString() === userId
      );
  
      if (!user) {
        ctx.status = 404;
        ctx.body = { error: 'User Not Found' };
        return;
      }
      group.members = group.members.filter(
        member => member._id.toString() !== userId
      );
      await group.save();
  
      ctx.status = 204;
    } catch (err) {
      ctx.status = 500;
      ctx.body = err;
    }
  },
};

module.exports = groupController;
