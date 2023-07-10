export default function handler(req, res) {
  const query = req.query;
  const { uid } = query;
  console.log(uid, ' login');

  connection.query(
    // 'SELECT * FROM molpumta_db.user_info WHERE id = ?',
    [uid],
    (error, results) => {
      if (error) {
        console.log("서버 오류");
        res.status(500).json({ error: 'Internal server error' });
      } else {
        //유효한 아이디
        if (results.length > 0) {
          console.log("친구 목록 보내기");
          connection.query(
            // get_friends
            '',
            [uid],
            (error, results) => {
              if (error) {
                console.log("친구 목록 가져오는 중 오류");
                res.status(500).json({ error: 'Internal server error' });
              } else {
                console.log("친구 목록 보내기");
                res.status(200).json({ message: 'Registration successful' });
              }
            }
          );
          res.status(200).json({ message: 'Registration successful' });
        } else {
          console.log("유저 아이디 오류");
          res.status(400).json({ message: 'Invalid UserId' });
        }
      }
    }
  );
}
