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
  const {userId, subjectId} = req.body;
  console.log(userId, subjectId, '과목 삭제 요청');

  connection.query(
    'SELECT study_id, user_id FROM study_list WHERE study_id = ? AND user_id = ?',
    [subjectId, userId],
    (error, results)=>{
        if(error){
            console.log("삭제 오류");
            res.status(500).json({error : 'Internal serval error'});
        }
        else if(results.length === 0){
            console.log("존재하지 않는 사용자거나 과목입니다.");
            res.status(400).json({message : '존재하지 않는 사용자거나 과목입니다.'});
        }
        else{
            connection.query(
                'UPDATE study_list SET isvalid = FALSE WHERE study_id = ? AND user_id = ?',
                [subjectId, userId],
                (error,results)=>{
                    if(error){
                        console.log("삭제 시 오류");
                        res.status(500).json({error: 'Internal serval error'});
                    }else{
                        console.log("과목 삭제 성공");
                        res.status(200).json({message : '삭제 성공'});
                    }
                }
            )
        }
    }
  )
}
