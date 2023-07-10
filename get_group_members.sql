SELECT UI.user_id AS user_id, UI.user_name AS user_name, UI.active AS isActive, GI.group_id AS group_id, GI.group_name AS group_name
FROM molpumta_db.user_info AS UI AND molpumta_db.group_info AS GI, molpumta_db.group_list AS GL
WHERE UI.user_id = GL.user_id AND GI.group_id = GL.group_id;