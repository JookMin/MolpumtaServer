import mysql from 'mysql';

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "jookmin",
  password: "madcamp",
  database: "molpumta_db",
});

export default function handler(req, res) {
  const {userId, subjectId, startTime, endTime} = req.body;
  console.log(userId, subjectId, startTime, endTime,  '공부 끝 기록 요청');

  connection.query(
    'SELECT * FROM molpumta_db.study_list WHERE user_id = ? AND study_id = ?',
    [userId, subjectId],
    (error, results)=>{
      if(error){
        console.log("공부 끝 기록 중 오류");
        res.status(400).json({error : 'Internal serval error'});
      }else if(results.length === 0){
        console.log("존재하지 않는 스터디 리스트");
        res.status(400).json({message : '존재하지 않는 스터디 리스트거나 사용자입니다.'});
      } else{
        connection.query(
          // 시작 기록 된 과목
          'SELECT * FROM study_time WHERE user_id = ? AND subject_id = ? AND start_time = ?',
          [userId, subjectId, startTime],
          (error, results)=>{
            if(error){
              console.log("과목 존재 여부 확인 중 오류");
              res.status(500).json({error : 'Internal server error'});
            } else if(results === 0){
              connection.query(
                'INSERT INTO molpumta_db.study_time VALUES(?,?,?,?)',
                [subjectId, userId, startTime, endTime],
                (error, results)=>{
                  if(error){
                    console.log('인서트 중 오류');
                    res.status(500).json({error : 'Internal server error'});
                  }else{
                    console.log('시작시간 삽입 성공');
                    res.status(201).json({message : '시작 시간 삽입 성공'});
                  }
                }
              )
            } else{
              connection.query(
                'UPDATE study_time SET end_time = ? WHERE user_id = ? AND start_time = ?',
                [endTime, userId, startTime],
                (error, results)=>{
                  if(error){
                    console.log("시간 업데이트 중 오류");
                    res.status(400).json({error : 'Internal serval error'});
                  }else{
                    connection.query(
                      'UPDATE user_info SET active = FALSE WHERE id = ?',
                      [userId],
                      (error, results)=>{
                        if(error){
                          console.log("엑티브 업데이트 중 오류");
                          res.status(500).json({error : 'Internal serval error'});
                        }else{
                          console.log("엑티브 업데이트 성공 및 종료 시간 삽입 성공");
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
    }
  )
}


// POST // 공부 종료 기록
// /record/start
//     'userId': '${user!.id}',
//     'subjectId': '${subject.id}',
//     'startTime': '$start',
//     'endTime': '$end',
// RESPONSE
// - statusCode : 200 (성공), 201 (시작 기록이 되어있지 않는 경우), 400 (실패 - 존재하지 않는 userId, 존재하지 않는 subjectId, startTime > endTime)
