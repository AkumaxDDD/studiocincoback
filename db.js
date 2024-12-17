import { createPool } from "mysql2/promise";


  export const pool =  createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port : 40668,
  });
  

