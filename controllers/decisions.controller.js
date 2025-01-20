const Decision = require('../models/decisions.model');
const Group = require('../models/groups.model');

const decisionController = {
  postDecision: async (ctx) => {
    const newDecision = new Decision(ctx.request.body);
    try {
      await newDecision.save();
      ctx.status = 201;
      ctx.body = newDecision;
    } catch (err) {
      ctx.status = 500;
      ctx.body = err;
    }
  },
  getDecisionById: async (ctx) => {
    const decisionId = ctx.params.decisionId;
    try {
      const decision = await Decision.findById({ _id: decisionId })
        .populate({ path: 'list', populate: { path: 'options' } })
        .populate({ path: 'group', populate: { path: 'members' } })

      if (!decision) {
        ctx.status = 404;
        ctx.body = { error: 'Decision Not Found' };
      } else {
        ctx.status = 200;
        ctx.body = decision;
      }
    } catch (err) {
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
    }
  },
  getDecisionByGroupId: async (ctx) => {
    const groupId = ctx.params.groupId;
    try {
      const decisionsInGroup = await Decision.find({ group: groupId });
      if (decisionsInGroup.length > 0) {
        ctx.status = 200;
        ctx.body = decisionsInGroup;
      } else {
        ctx.status = 404;
        ctx.body = { error: 'Decisions Not Found' };
      }
    } catch (err) {
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
    }
  },
  updateDecisionById: async (ctx) => {
    const decisionId = ctx.params.decisionId;
    const decisionInput = ctx.request.body;

    try {
      const updatedDecision = await Decision.findByIdAndUpdate(
        decisionId,
        decisionInput,
        {
          new: true,
        }
      );
      if (!updatedDecision) {
        ctx.status = 404;
        ctx.body = { error: 'Decision Not Found' };
      } else {
        ctx.status = 200;
        ctx.body = updatedDecision;
      }
    } catch (err) {
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
    }
  },
  getDecisionByUserId: async (ctx) => {
    const userId = ctx.params.userId;
    let decisionsGroups = [];
    try {
      const groups = await Group.find({ members: { $in: [userId] } });

      for (const group of groups) {
        const decisions = await Decision.find({ group: group._id });
        decisionsGroups.push(...decisions);
      }
      if (decisionsGroups.length === 0) {
        ctx.status = 404;
        ctx.body = { error: 'Decisions Not Found' };
      } else {
        ctx.status = 200;
        ctx.body = decisionsGroups;
      }
    } catch (err) {
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
    }
  },
  deleteDecisionById: async (ctx) => {
    const decisionId = ctx.params.decisionId;
    try {
      const decision = await Decision.findOneAndDelete({ _id: decisionId });

      if (!decision) {
        ctx.status = 404;
        ctx.body = { error: 'Decision Not Found' };
      } else {
        ctx.status = 204;
      }
    } catch (err) {
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
    }
  },
};

module.exports = decisionController;
