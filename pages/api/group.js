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
  const query = req.query;
  const uid = query.uid;
  console.log(uid, '그룹 목록 요청');

  connection.query(
    'SELECT id FROM molpumta_db.user_info WHERE id = ?',
    [uid],
    (error, results) => {
      if (error) {
        console.log("그룹 불러오는 중 오류");
        res.status(500).json({ error: 'Internal serval error' });
      } else if (results === 0) {
        console.log("존재하지 않는 사용자");
        res.status(400).json({ error: '존재하지 않는 사용자' });
      } else {
        connection.query(
          `SELECT UI.id AS user_id, UI.username AS user_name, UI.active AS active, UI.state AS state, GI.group_id AS group_id, GI.group_name AS group_name 
          FROM molpumta_db.user_info AS UI, molpumta_db.group_info AS GI, molpumta_db.group_list AS GL          
          WHERE UI.id = GL.user_id AND GI.group_id = GL.group_id AND GI.group_id IN (
            SELECT GI.group_id FROM user_info AS UI, molpumta_db.group_info AS GI, molpumta_db.group_list AS GL
            WHERE UI.id = GL.user_id AND GI.group_id = GL.group_id AND UI.id = ?
          )
          ORDER BY group_id;`,
          [uid],
          (error, results) => {
            console.log(results, "그룹화된 것");
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
                console.log(item)
                console.log(row)
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
              console.log('친구 목록 보내기 성공');
              res.status(200).json(list)
            }
          }
        )
      }
    }
  )
}
