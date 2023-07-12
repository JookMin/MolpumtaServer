import mysql from 'mysql';
import { reset } from 'nodemon';

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
    console.log(uid, '통계 요청');

    connection.query(
        'SELECT * FROM molpumta_db.user_info WHERE id = ?',
        [uid],
        (error, results) => {
            if (error) {
                console.log("서버 오류");
                res.status(500).json({ error: 'Internal server error' });
            } else if (results === 0) {
                console.log("존재하지 않는 사용자");
                res.status(400).json({ message: '존재하지 않는 사용자' });
            } else {
                connection.query(
                    `
                    SELECT YEAR(D.Date) AS year, MONTH(D.Date) AS month, DAY(D.Date) AS date, D.subject_id AS subject_id, SUM(D.Dur) AS totalTime, D.subject_name AS subject_name
                    FROM (
                        SELECT ST.subject_id AS subject_id, TIME_TO_SEC(TIMEDIFF(ST.end_time, ST.start_time)) AS Dur, DATE(ST.start_time) AS Date, SL.subject_name AS subject_name
                        FROM user_info AS UI, study_list AS SL, study_time AS ST
                        WHERE UI.id = SL.user_id AND SL.study_id = ST.subject_id AND UI.id = ? AND TIME_TO_SEC(TIMEDIFF(ST.end_time, ST.start_time)) IS NOT NULL
                    ) AS D
                    GROUP BY D.Date, D.subject_id
                    `,
                    [uid],
                    (error, results) => {
                        console.log("results", results);
                        if (error) {
                            console.log("error", error);
                            res.status(500).json({error : 'Internal server error'});
                        }
                        else {
                            console.log("성공");
                            const list = results.map((row)=>({
                                year : row.year,
                                month: row.month,
                                date: row.date,
                                subjectId: row.subject_id,
                                subjectName: row.subject_name,
                                duration: row.totalTime,
                            }));
                            res.status(200).json(list);
                        }
                    }
                )
            }
        }
    );
}