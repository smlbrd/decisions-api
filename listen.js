const app = require('../decisions-api/app');

const { PORT = 9090 } = process.env;

app.listen(PORT, '0.0.0.0', () =>
  console.log(`Server up! Listening on ${PORT}!`)
);
