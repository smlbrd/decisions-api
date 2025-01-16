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
      console.log('decision:', decision, 'decisionId:', decisionId);
      if (!decision) {
        ctx.status = 404;
        ctx.body = { error: 'Decision Not Found' };
        console.log('Error in decision')
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
  }

};
module.exports = decisionController;
