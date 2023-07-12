USE molpumta_db;

CREATE TABLE study_list (
	study_id INT NOT NULL,
	subject_name VARCHAR(20) DEFAULT '',
	user_id BIGINT NOT NULL,
	isvalid BOOLEAN DEFAULT TRUE,
	PRIMARY KEY(study_id, user_id),
	FOREIGN KEY (user_id) REFERENCES user_info (id) ON UPDATE CASCADE
);