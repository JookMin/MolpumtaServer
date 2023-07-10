export default function handler(req, res) {
  const query = req.query;
  const { userId, subjectId, startTime, endTime } = query;
  console.log(userId, subjectId, startTime, endTime,  '공부 끝 기록 요청');
}
