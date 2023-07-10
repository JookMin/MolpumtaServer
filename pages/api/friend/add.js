export default function handler(req, res) {
  const query = req.query;
  const { userId1, userId2 } = query;
  console.log(userId1, userId2, '친구 추가 요청');
}
