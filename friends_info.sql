USE molpumta_db;

CREATE TABLE friensds_info (
	my_id INT NOT NULL,
    friend_id INT NOT NULL,
    FOREIGN KEY(my_id) REFERENCES user_info (id) ON UPDATE CASCADE,
    FOREIGN KEY(friend_id) REFERENCES user_info (id) ON UPDATE CASCADE
);