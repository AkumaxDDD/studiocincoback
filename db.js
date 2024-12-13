import mysql from 'mysql2/promise';

export const conectarDB = async () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // Ajusta según tus necesidades
    queueLimit: 0,
  });

  try {
    const connection = await pool.getConnection();
    console.log('Conexión a la base de datos establecida');
    connection.release();
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    throw error;
  }

  return pool;
};
