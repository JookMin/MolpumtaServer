import { error } from 'console';
import mysql from 'mysql';

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "jookmin",
  password: "madcamp",
  database: "molpumta_db",
});

export default function handler(req, res) {
  const {userId, subjectId, startTime} = req.body;
  console.log(userId, subjectId, startTime,  '공부 시작 기록 요청');

  connection.query(
    'SELECT id FROM molpumta_db.user_info WHERE id = ?',
    [userId],
    (error, results)=>{
      if(error){
        console.log("공부 시간 삽입 중 오류");
        res.status(500).json({error : 'Internal serval error'});
      }else if(results === 0){
        console.log("존재하지 않는 사용자입니다.");
        res.status(400).json({message : "존재하지 않는 사용자입니다."});
      }else{
        connection.query(
          'INSERT INTO molpumta_db.study_time (subject_id, user_id, start_time) VALUES (? ,?, ?)',
          [subjectId, userId, startTime],
          (error, results)=>{
            if(error){
              console.log("시작 시간 삽입 중 오류",error);
              res.status(500).json({error : 'Internal serval error'});
            }else{
              connection.query(
                'UPDATE user_info SET active = TRUE WHERE id = ?',
                [userId],
                (error, results)=>{
                  if(error){
                    console.log("엑티브 업데이트 중 오류");
                    res.status(500).json({error : 'Internal serval error'});
                  }else{
                    console.log("엑티브 업데이트 성공 및 시작 시간 삽입 성공");
                    res.status(200).json({message: '시작 시간 삽입 성공'})
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


// POST // 공부 시작 기록
// /record/start
//     'userId': '${user!.id}',
//     'subjectId': '${subject.id}',
//     'startTime': '$start',
// RESPONSE
// - statusCode : 200 (성공), 400 (실패 - 존재하지 않는 userId, 존재하지 않는 subjectId)
