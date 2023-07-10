const mysql = require('mysql');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "jookmin",
    password: "madcamp",
    database: "molpumta_db",
  });

//   console.log(connection);

connection.query('SELECT * FROM user_info WHERE id = ?', ['test'], (err, results, fields) => {
    if(err) throw err;
    console.log(results);
});

