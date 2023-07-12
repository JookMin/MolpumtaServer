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
  console.log(query.uid, query.name, '로그인 요청');
  const uid  = query.uid;
  const name = query.name;
  console.log(uid, '로그인 요청');

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
            'SELECT study_id, subject_name FROM molpumta_db.study_list WHERE user_id = ? AND isvalid = TRUE',
            [uid],
            (error, results) =>{
              if(error){
                console.log("과목 리턴 중 오류");
                res.status(500).json({error : 'Internal server error'});
              } else {
                console.log('과목 정보 불러오기 성공');
                const list = results.map((row) => ({
                  subjectId : row.study_id,
                  subjectName : row.subject_name,
                }));
                console.log(list);
                res.status(200).json(list);
              }
            }
          )
        } else {
          console.log("회원가입 진행 ", name);
          connection.query(
            'INSERT INTO user_info VALUES (?, ? , FALSE, 0)',
            [uid, name],
            (error, results) => {
              if (error) {
                console.log("회원가입 중 오류",error);
                res.status(500).json({ error: 'Internal server error' });
              } else {
                const init_name = '자습';
                connection.query(
                  'INSERT INTO study_list VALUES(0,?,?,true)',
                  [init_name,uid],
                  (error, results)=>{
                    if(error){
                      console.log("초기 자습 값 삽입 실패", error);
                      res.status(500).json({error : 'Internal server error'})
                    }else{
                      console.log("초기 자습 값 삽입 성공 및 회원가입 성공");
                      res.status(201).json([{subjectId: 0, subjectName: '자습'}]);
                    }
                  } 
                )
              }
            }
          );
        }
      }
    }
  );
}
