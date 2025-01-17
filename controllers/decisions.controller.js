const Decision = require('../models/decisions.model');

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
      const decision = await Decision.findById({ _id: decisionId });

      if (!decision) {
        ctx.status = 404;
        ctx.body = { error: 'Decision Not Found' };
      }
      else {
        ctx.status = 200;
        ctx.body = decision;
      }
    }
    catch (err) {
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
    }
  },
  getDecisionByGroupId: async (ctx) => {
    const groupId = ctx.params.groupId;
    try {
      const decisionsInGroup = await Decision.find({ group: groupId });
      console.log('Decisions found: ', decisionsInGroup);
      if (decisionsInGroup.length > 0) {
        ctx.status = 200;
        ctx.body = decisionsInGroup
      }
      else {
        ctx.status = 404;
        ctx.body = { error: 'Decisions Not Found' };
      }
    }
    catch (err) {
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
    }
  },
};
module.exports = decisionController;
