export default function handler(req, res) {
  const query = req.query;
  const { userId, groupId } = query;
  console.log(userId, groupId, '그룹 가입 요청');
}
