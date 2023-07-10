export default function handler(req, res) {
  const query = req.query;
  const { userId, groupName } = query;
  console.log(userId, groupName, '그룹 생성 요청');
}
