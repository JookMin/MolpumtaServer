import mysql from 'mysql';

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "jookmin",
  password: "madcamp",
  database: "molpumta_db",
});

export default function handler(req, res) {
  const query = req.query;
  const uid = query.uid;
  console.log(uid, ' 친구 목록 요청');

  connection.query(
    'SELECT * FROM molpumta_db.user_info WHERE id = ?',
    [uid],
    (error, results) => {
      if (error) {
        console.log("서버 오류");
        res.status(500).json({ error: 'Internal server error' });
      } else {
        if (results.length > 0) {
          connection.query(
            'SELECT U.id, U.username, U.active, U.state FROM molpumta_db.friends_info AS F JOIN molpumta_db.user_info AS U ON F.friend_id = U.id WHERE F.my_id = ?',
            [uid],
            (error, results) => {
              if (error) {
                console.log("친구 목록 가져오는 중 오류", error);
                res.status(500).json({ error: 'Internal server error' });
              } else {
                console.log("친구 목록 보내기 성공");
                const friend_data = results.map((row) => ({
                  userId : row.id,
                  userName : row.username,
                  studying: Boolean(row.active),
                  mood: row.state,
                }));
                console.log(friend_data);
                res.status(200).json(friend_data);
              }
            }
          );
        } else {
          console.log("유저 아이디 오류");
          res.status(400).json({ message: 'Invalid UserId' });
        }
      }
    }
  );
}