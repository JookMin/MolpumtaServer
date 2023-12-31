import mysql from 'mysql';

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "jookmin",
  password: "madcamp",
  database: "molpumta_db",
});

export default function handler(req, res) {
  const {userId1, userId2} = req.body;
  console.log(userId1, userId2, '친구 추가 요청');

  connection.query(
    `SELECT u1.id, u2.id 
     FROM user_info u1, user_info u2 
     WHERE u1.id = ? AND u2.id = ? AND u1.id <> u2.id AND NOT EXISTS(SELECT * FROM friends_info WHERE my_id = u1.id AND friend_id = u2.id)`,
    [userId1, userId2],
    (error, results) =>{
      if (error) {
        console.log("친구 추가 중 서버 오류");
        res.status(500).json({ error: 'Internal server error' });
      } 
      else if (results.length){
        connection.query(
          'INSERT INTO molpumta_db.friends_info VALUES(?, ?)',
          [userId1, userId2],
          (error, results) =>{
            if(error){
              console.log("친구 추가 중 오류");
              res.status(500).json({error : 'Internal serval error'});
            }else{
              connection.query(
                'INSERT INTO molpumta_db.friends_info VALUES(?, ?)',
                [userId2, userId1],
                (error, results) =>{
                  if(error){
                    console.log("친구 추가 중 오류");
                    res.status(500).json({error : 'Internal serval error'});
                  } else{
                    connection.query(
                      'SELECT U.id, U.username, U.active, U.state FROM molpumta_db.friends_info AS F JOIN molpumta_db.user_info AS U ON F.friend_id = U.id WHERE F.my_id = ?',
                      [userId1],
                      (error, results) =>{
                        if(error){
                          console.log("친구 목록 불러오는 중 오류");
                          res.status(500).json({error : 'Internal serval error'});
                        }else{
                          console.log("친구 목록 불러오기 완료");
                          const friends = results.map((row) => ({
                            userId : row.id,
                            userName : row.username,
                            studying: Boolean(row.active),
                            mood : row.state
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
        console.log("이미 존재하거나 친구 아이디가 잘못된 오류");
        res.status(400).json({message : "친구가 이미 존재하거나 친구 아이디가 없습니다."});
      }
    }
  )
}


//성공한 경우 201 리턴
//실패한 경우 400리턴(이미 친구이거나 데이터 베이스에 해당 아이디가 없는 경우)