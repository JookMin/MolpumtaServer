USE molpumta_db;

CREATE TABLE group_list (
	group_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user_info (id) ON UPDATE CASCADE,
    FOREIGN KEY (group_id) REFERENCES group_info (group_id) ON UPDATE CASCADE
);