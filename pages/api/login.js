import mysql from 'mysql';

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "jookmin",
  password: "madcamp",
  database: "molpumta_db",
});

export default function handler(req, res) {
  const { uid } = req.body;

  connection.query(
    'SELECT * FROM molpumta_db.user_info WHERE id = ?',
    [uid],
    (error, results) => {
      if (error) {
        console.log("서버 오류");
        res.status(500).json({ error: 'Internal server error' });
      } else {
        if (results.length > 0) {
          console.log("로그인");
          res.status(200).json({ message: 'Login successful' });
        } else {
          console.log("회원가입 진행");
          connection.query(
            'INSERT INTO molpumta_db.user_info (id) VALUES (?)',
            [uid],
            (error, results) => {
              if (error) {
                console.log("회원가입 중 오류");
                res.status(500).json({ error: 'Internal server error' });
              } else {
                console.log("회원가입 완료");
                res.status(200).json({ message: 'Registration successful' });
              }
            }
          );
        }
      }
    }
  );
}
