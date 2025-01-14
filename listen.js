const app = require('../decisions-api/app');

const { PORT = 9090 } = process.env;

app.listen(PORT, 'localhost', () =>
  console.log(`Server up! Listening on ${PORT}!`)
);
