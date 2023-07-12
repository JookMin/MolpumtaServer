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
  const { userId, groupName } = req.body;
  var groupId = null;
  console.log(userId, groupName, '그룹 생성 요청');

  connection.query(
    'SELECT id FROM molpumta_db.user_info WHERE id = ?',
    [userId],
    (error, results) => {
      if (error) {
        console.log("그룹 추가 중 오류");
        res.status(500).json({ error: 'Internal serval error' });
      } else if (results.length === 0) {
        console.log("존재하지 않는 사용자 입니다.");
        res.status(400).json({ message: "존재하지 않는 사용자입니다." });
      } else {
        connection.query(
          'INSERT INTO molpumta_db.group_info (group_name) VALUES(?)',
          [groupName],
          (error, results) => {
            if (error) {
              console.log("그룹 추가 중 오류2");
              res.status(500).json({ error: 'Internal serval error' });
            } else {
              groupId = results.insertId;
              connection.query(
                'INSERT INTO molpumta_db.group_list VALUES(?,?)',
                [groupId, userId],
                (error, results) => {
                  if (error) {
                    console.log("그룹 리스트에 삽입 중 문제");
                    res.status(500).json({ error: 'Internal serval error' });
                  } else {
                    connection.query(
                      `SELECT UI.id AS user_id, UI.username AS user_name, UI.active AS active, UI.state AS state, GI.group_id AS group_id, GI.group_name AS group_name 
                      FROM molpumta_db.user_info AS UI, molpumta_db.group_info AS GI, molpumta_db.group_list AS GL          
                      WHERE UI.id = GL.user_id AND GI.group_id = GL.group_id AND GI.group_id IN (
                        SELECT GI.group_id FROM user_info AS UI, molpumta_db.group_info AS GI, molpumta_db.group_list AS GL
                        WHERE UI.id = GL.user_id AND GI.group_id = GL.group_id AND UI.id = ?
                      )
                      ORDER BY group_id;`,
                      [userId],
                      (error, results) => {
                        console.log(results);
                        if (error) {
                          console.log("그룹화 중 오류");
                          res.status(500).json({ error: 'Internal serval error' });
                        } else {
                          var gid = -1;
                          var list = []
                          var gname = '';
                          var gmem = []
                          for (var row of results) {
                            let item = JSON.parse(JSON.stringify(row));
                            if (gid != item.group_id && gid != -1) {
                              list.push({ groupId: gid, groupName: gname, members: JSON.stringify(gmem) })
                              gmem = []
                            }
                            gid = item.group_id
                            gname = item.group_name
                            var tmp = new Object();
                            tmp.userId = item.user_id
                            tmp.userName = item.user_name
                            tmp.studying = Boolean(item.active)
                            tmp.mood = item.state
                            gmem.push(JSON.parse(JSON.stringify(tmp)))
                          }
                          if (gid != -1) list.push({ groupId: gid, groupName: gname, members: JSON.stringify(gmem) })
                          console.log("그룹 추가 성공");
                          res.status(201).json(list);
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
