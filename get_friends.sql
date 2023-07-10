SELECT U.user_id AS friend_id, U.user_name AS friend_id, U.active AS isActive
FROM molpumta_db.user_info AS U AND molpumta_db.friends_info AS F
WHERE U.user_id = F.friend_id AND F.me_id = ?;