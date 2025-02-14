import { config } from 'dotenv';
import { expand } from 'dotenv-expand';

const env = config();
expand(env);

export default {
  env: {
    ...process.env
  }
}; 