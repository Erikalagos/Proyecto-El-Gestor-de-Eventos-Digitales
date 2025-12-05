import sql from 'mssql';
           
const dbSettings = {
  user: "sa",
  password: "-----", // O la contraseña que estés usando
  server: "-----",       // O tu nombre de servidor
  database: "AsistentesDB",   // <-- ¡EL ÚNICO CAMBIO!
  options: {
      encrypt: false,
      trustServerCertificate: true,
      port: 1433,
  }
}

export const getConnection = async () => {
  try {
      // Cambio el log para saber a qué BD se conectó
      const pool = await sql.connect(dbSettings);
      console.log('Conectado a SQL Server (AsistentesDB)'); 
      
      return pool;
  } catch (error){
      console.error('Error de conexión a la base de datos:', error);
      console.error(error);
  }
}