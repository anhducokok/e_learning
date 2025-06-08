import { Pool } from "pg";

const pool = new Pool({
  user: process.env.PGUSER || "postgres", // tên user postgres
  host: process.env.PGHOST || "localhost",
  database: process.env.PGDATABASE || "shub_classroom", // tên database
  password: process.env.PGPASSWORD || "123123", // mật khẩu
  port: Number(process.env.PGPORT) || 5432,
});

export default {
  query: (text: string, params?: any[]) => pool.query(text, params),
};
