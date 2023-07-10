export default function handler(req, res) {
  const query = req.query;
  const { userId, subjectId, startTime } = query;
  console.log(userId, subjectId, startTime, '공부 시작 기록 요청');
}
