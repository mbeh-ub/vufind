-- 
-- Modifications to table `record`
--

ALTER TABLE "record" 
	ADD COLUMN user_id int,
	ADD COLUMN resource_id int;
	
ALTER TABLE "record" DROP CONSTRAINT record_record_id_source_key; 