import * as dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: Number(process.env.PORT),
  db: {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    name: process.env.DB_NAME,
  },
};
