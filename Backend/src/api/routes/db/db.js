// Importa el módulo 'mysql'
const mysql = require('mysql');

// Limpia el caché de módulos antes de crear la conexión
Object.keys(require.cache).forEach(function(key) {
    delete require.cache[key];
});

// Define la configuración de la conexión a la base de datos
const dbConfig = {
   host: 'localhost',
   user: 'root', // Usuario de la base de datos
   password: '', // Contraseña de la base de datos
   database: 'registro'
};

// Crea una conexión a la base de datos utilizando la configuración
const db = mysql.createConnection(dbConfig);

module.exports = {
   connect: () => {
      db.connect((err) => {
         if (err) {
            throw err;
         }
         console.log('MySQL Connected...');
      });
      return db;
   },
   query: (sql, values, callback) => {
      return db.query(sql, values, callback);
   }
};
