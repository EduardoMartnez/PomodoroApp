const mysql = require('mysql');

let connection;

exports.getDatabaseConnection = () => {
  if(!connection) {
    connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      multipleStatements: true
    })
  }
  return connection;
};

exports.query = (query, params = []) => {
  return new Promise((resolve, reject) => {
    if(!connection) {
      connection = exports.getDatabaseConnection();
    }
    connection.query(query, params, (err, results, fields) => {
      if(err) {
        // console.log(err);
        return reject(err);
      }
      resolve({
        results: results,
        fields: fields
      })
    })
  });
};

exports.close = () => {
  if(connection) {
    connection.end();
    connection = null;
  }
};