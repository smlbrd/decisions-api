const fs = require('fs/promises');

const controller = {
  getEndpoints: async (ctx) => {
    try {
      const endpoints = await fs.readFile(
        `${__dirname}/../endpoints.json`,
        'UTF8'
      );
      ctx.body = JSON.parse(endpoints);
    } catch (err) {
      console.log(err);
      ctx.status = 500;
      ctx.body = err;
    }
  },
};

module.exports = controller;
