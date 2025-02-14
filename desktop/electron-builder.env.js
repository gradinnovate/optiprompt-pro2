const { config } = require('dotenv');
const { expand } = require('dotenv-expand');

const env = config();
expand(env);

module.exports = {
  env: {
    ...process.env
  }
}; 