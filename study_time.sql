USE molpumta_db;

CREATE TABLE study_time (
	subject_id INT NOT NULL,
	start_time DATETIME,
    end_time DATETIME,
    FOREIGN KEY(subject_id) REFERENCES study_list(study_id) ON UPDATE CASCADE
);