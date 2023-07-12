USE molpumta_db;
CREATE TABLE study_time (
	subject_id INT NOT NULL,
    user_id BIGINT NOT NULL,
	start_time DATETIME,
    end_time DATETIME
);