export default function handler(req, res) {
  const query = req.query;
  const { uid } = query;
  console.log(uid, '그룹 요청');
}