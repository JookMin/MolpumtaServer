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
  const {userId, subjectId, subjectName} = req.body;
  console.log(userId, subjectId, subjectName, '과목 편집 요청');

  connection.query(
    'SELECT id FROM user_info WHERE id = ?',
    [userId],
    (error, results) =>{
      if(error){
        console.log("과목 편집 중 오류");
        res.status(500).json({error : 'Internal serval error'});
      }else if(results.length > 0){
        connection.query(
          'SELECT study_id, user_id FROM molpumta_db.study_list WHERE study_id = ? AND user_id = ?',
          [subjectId, userId],
          (error, results) =>{
            if(error){
              console.log("과목 리스트 불러오기 중 오류");
              res.status(500).json({error : 'Internal serval error'});
            }else if(results.length == 0){
              console.log("과목이 존재하지 않습니다.");
              res.status(400).json({message : '과목이 존재하지 않습니다.'});
            }else{
              connection.query(
                'UPDATE molpumta_db.study_list SET subject_name = ? WHERE study_id = ? AND user_id = ?',
                [subjectName, subjectId, userId],
                (error, results) =>{
                  if(error){
                    console.log("과목 편집 중 오류");
                    res.status(500).json({error: 'Internal serval error'});
                  } else{
                    console.log("과목 편집 성공");
                    res.status(200).json({message : '과목이 추가되었습니다'});
                  }
                }
              )
            }
          }
        )
      }else{
        console.log("존재하지 않는 사용자");
        res.status(400).json({error : '존재하지 않는 사용자입니다.'});
      }
    }
  )
}
