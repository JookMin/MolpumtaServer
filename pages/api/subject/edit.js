export default function handler(req, res) {
  const query = req.query;
  const { userId, subjectId, subjectName } = query;
  console.log(userId, subjectId, subjectName, '과목 편집');
}
