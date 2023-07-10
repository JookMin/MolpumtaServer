SELECT U.user_id AS user_id, S.study_id AS study_id, S.subject_name AS subject_name
FROM molpumta_db.study_list AS S AND molpumta_db.user_info AS U
WHERE S.user_id = U.user_id AND U.user_id = ?;