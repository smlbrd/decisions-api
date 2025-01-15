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
};

module.exports = decisionController;
