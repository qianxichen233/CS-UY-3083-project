SELECT *
	FROM flight
	WHERE departure_date_time > NOW();

SELECT *
	FROM flight
	WHERE status = "delayed";

WITH purchased_customer(email) AS
(
	SELECT DISTINCT email
		FROM ticket
)
SELECT first_name, last_name
	FROM purchased_customer NATURAL JOIN customer;

SELECT *
	FROM airplane
	WHERE airline_name = "Jet Blue";