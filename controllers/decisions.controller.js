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
  updateDecisionById: async (ctx) => {
    const decisionId = ctx.params.decisionId;
    const decisionInput = ctx.request.body;

    try {
      const updatedDecision = await Decision.findByIdAndUpdate(decisionId, decisionInput, {
        new: true,
      });
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
};
module.exports = decisionController;
