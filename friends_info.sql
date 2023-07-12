USE molpumta_db;

CREATE TABLE friends_info (
	my_id BIGINT NOT NULL,
    friend_id BIGINT NOT NULL,
    FOREIGN KEY(my_id) REFERENCES user_info (id) ON UPDATE CASCADE,
    FOREIGN KEY(friend_id) REFERENCES user_info (id) ON UPDATE CASCADE
);