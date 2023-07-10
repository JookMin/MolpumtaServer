USE molpumta_db;

CREATE TABLE study_list (
	study_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	subject_name VARCHAR(20) DEFAULT '',
	user_id INT NOT NULL,
	FOREIGN KEY (user_id) REFERENCES user_info (id) ON UPDATE CASCADE
);