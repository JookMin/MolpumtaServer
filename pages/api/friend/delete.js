import mysql from 'mysql';

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "jookmin",
  password: "madcamp",
  database: "molpumta_db",
});

export default function handler(req, res) {
  const {userId, friendId} = req.body;
  console.log(userId, friendId, '친구 삭제 요청');

  connection.query(
    'SELECT my_id, friend_id FROM friends_info WHERE my_id = ? AND friend_id = ?',
    [userId, friendId],
    (error, results) =>{
      if (error) {
        console.log("친구 삭제 중 서버 오류");
        res.status(500).json({ error: 'Internal server error' });
      } 
      else if (results.length){
        connection.query(
          'DELETE FROM friends_info WHERE my_id = ? AND friend_id = ?',
          [userId, friendId],
          (error, results) =>{
            if(error){
              console.log("친구 삭제 중 오류", error);
              res.status(500).json({error : 'Internal serval error'});
            }else{
              connection.query(
                'DELETE FROM friends_info WHERE my_id = ? AND friend_id = ?',
                [friendId, userId],
                (error, results) =>{
                  if(error){
                    console.log("친구 삭제 중 오류", error);
                    res.status(500).json({error : 'Internal serval error'});
                  } else{
                    connection.query(
                      'SELECT U.id, U.username, U.active, U.state FROM molpumta_db.friends_info AS F JOIN molpumta_db.user_info AS U ON F.friend_id = U.id WHERE F.my_id = ?',
                      [userId],
                      (error, results) =>{
                        if(error){
                          console.log("친구 목록 불러오는 중 오류");
                          res.status(500).json({error : 'Internal serval error'});
                        }else{
                          console.log("친구 목록 불러오기 완료 및 삭제 성공");
                          const friends = results.map((row) => ({
                            userId : row.id,
                            userName : row.username,
                            studying: Boolean(row.active),
                            mood: row.state
                          }));
                          res.status(201).json(friends);
                        }
                      }
                    )
                  }
                }
              )
            }
          }
        )
      }
      else{
        console.log("이미 친구가 아닌 경우");
        res.status(400).json({message : "이미 친구가 아닙니다"});
      }
    }
  )
}


//성공한 경우 201 리턴
//실패한 경우 400리턴(이미 친구이거나 데이터 베이스에 해당 아이디가 없는 경우)