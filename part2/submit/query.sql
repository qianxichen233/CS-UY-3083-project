/* Show all the future flights in the system */

SELECT *
	FROM flight
	WHERE departure_date_time > NOW();

/*
Execution Result (First 25 rows out of 33 rows):
airline_name	flight_number	departure_date_time	departure_airport_code	arrival_date_time	arrival_airport_code	base_price	airplane_ID	status	
Air Canada	45	2023-12-09 23:19:28	LEJ	2023-12-10 16:19:28	FLG	67.50	0	delayed	
Air Canada	69	2024-05-16 05:14:36	DAC	2024-05-16 21:14:36	DAC	401.54	1	delayed	
Air Canada	94	2024-05-12 09:54:32	CIA	2024-05-12 18:54:32	AIH	524.85	4	departed	
Air Canada	101	2023-10-26 13:41:18	XSP	2023-10-27 00:41:18	HYA	625.94	5	scheduled	
Air Canada	105	2024-09-26 13:05:05	ALO	2024-09-26 17:05:05	YPW	659.46	2	ontime	
Air Canada	195	2024-01-24 06:26:05	HYA	2024-01-24 16:26:05	FLG	664.06	8	ontime	
Air France	31	2024-01-03 08:38:02	LEJ	2024-01-03 16:38:02	AIH	390.43	11	delayed	
Air France	62	2023-05-24 13:09:22	KPO	2023-05-24 17:09:22	ALO	186.28	9	scheduled	
Air France	151	2023-09-05 16:37:41	KPO	2023-09-06 09:37:41	YBC	502.76	8	scheduled	
Alaska Airlines	65	2023-10-04 10:48:40	KPO	2023-10-05 03:48:40	DAC	367.33	2	departed	
Alaska Airlines	74	2024-10-14 17:02:03	MOQ	2024-10-14 22:02:03	AIH	527.18	3	arrived	
Alaska Airlines	85	2024-01-26 00:52:47	AKD	2024-01-26 14:52:47	ILO	586.22	2	ontime	
Alaska Airlines	196	2023-06-10 19:49:15	ILO	2023-06-11 04:49:15	AIH	500.78	4	ontime	
American Airlines	48	2024-07-04 18:50:19	MOQ	2024-07-05 12:50:19	DNG	362.87	1	departed	
American Airlines	78	2023-06-16 13:02:29	ILO	2023-06-17 02:02:29	XSP	123.12	1	arrived	
American Eagle Airlines	48	2024-07-25 22:35:10	DNG	2024-07-26 01:35:10	YUJ	483.96	3	arrived	
American Eagle Airlines	100	2023-12-05 01:36:03	AIH	2023-12-05 15:36:03	AIH	88.64	2	scheduled	
American Eagle Airlines	118	2023-06-01 11:10:36	FLG	2023-06-02 01:10:36	ILO	165.41	7	scheduled	
American Eagle Airlines	162	2023-09-15 11:44:33	MOQ	2023-09-16 01:44:33	MKP	55.83	0	scheduled	
American Eagle Airlines	173	2023-05-22 07:16:59	MOQ	2023-05-22 10:16:59	AKD	438.02	0	arrived	
British Airways	97	2023-05-06 14:55:55	ALO	2023-05-07 05:55:55	ZGU	455.91	6	ontime	
British Airways	138	2023-07-09 03:19:54	AIH	2023-07-09 04:19:54	LDZ	51.61	8	arrived	
Delta Air Line	160	2023-11-14 04:34:22	MOQ	2023-11-14 14:34:22	YPW	526.33	7	departed	
Delta Air Line	177	2023-08-23 10:44:47	ILO	2023-08-23 17:44:47	KPO	550.68	0	departed	
Jet Blue	99	2023-07-20 20:07:20	MOQ	2023-07-21 14:07:20	ALO	380.53	11	arrived	
*/

/* Show all of the delayed flights in the system */

SELECT *
	FROM flight
	WHERE status = "delayed";

/*
Execution Result:
airline_name	flight_number	departure_date_time	departure_airport_code	arrival_date_time	arrival_airport_code	base_price	airplane_ID	status	
Air Canada	45	2023-12-09 23:19:28	LEJ	2023-12-10 16:19:28	FLG	67.50	0	delayed	
Air Canada	69	2024-05-16 05:14:36	DAC	2024-05-16 21:14:36	DAC	401.54	1	delayed	
Air Canada	139	2023-01-31 10:33:24	DAC	2023-02-01 02:33:24	KPO	659.93	5	delayed	
Air Canada	181	2020-12-16 23:14:41	CIA	2020-12-17 00:14:41	XSP	521.91	0	delayed	
Air France	31	2024-01-03 08:38:02	LEJ	2024-01-03 16:38:02	AIH	390.43	11	delayed	
Air France	175	2020-09-01 05:13:02	YUJ	2020-09-01 08:13:02	DAC	339.91	6	delayed	
American Airlines	149	2021-11-01 17:05:02	CIA	2021-11-02 03:05:02	LEJ	656.58	2	delayed	
British Airways	123	2021-03-15 07:42:11	AKD	2021-03-15 17:42:11	ILO	88.01	0	delayed	
Delta Air Line	121	2020-05-01 14:41:07	XSP	2020-05-02 03:41:07	ZGU	241.78	3	delayed	
Jet Blue	75	2022-11-21 02:43:31	DNG	2022-11-21 08:43:31	LEJ	697.54	13	delayed	
Southwest	49	2023-01-18 06:00:08	SUR	2023-01-18 07:00:08	MOQ	444.47	3	delayed	
Southwest	64	2023-09-30 10:41:20	LEJ	2023-09-30 19:41:20	KPO	578.65	3	delayed	
Southwest	167	2022-01-01 13:27:31	YUJ	2022-01-02 02:27:31	MOQ	611.93	5	delayed	
United	113	2023-12-01 08:57:08	XSP	2023-12-01 12:57:08	YPW	333.32	6	delayed	
United	137	2023-01-08 23:18:06	LDZ	2023-01-09 17:18:06	SUR	389.19	1	delayed	
*/

/* Show the customer names who bought the tickets */

WITH purchased_customer(email) AS
(
	SELECT DISTINCT email
		FROM ticket
)
SELECT first_name, last_name
	FROM purchased_customer NATURAL JOIN customer;

/*
Execution Result: (First 25 rows out of 30 rows)
first_name	last_name	
Archibold	Daveran	
Alex	McCormick	
Bryana	Buffery	
Bird	Casserley	
Bernadine	Danels	
Buck	Warnes	
Cilka	Cattonnet	
Cobbie	Myrick	
Christina	Thurlby	
Delora	Nisard	
Elly	Brennand	
Edithe	Roeby	
Fairfax	Fuzzey	
Gustie	Sheber	
Ilyse	Donaldson	
Ida	Jeffes	
Jarrad	Bomb	
Jared	Lenoir	
Ky	Pridgeon	
Kathlin	Sheehan	
Lucio	Hardbattle	
Marylou	Baudts	
Martyn	Poytheras	
Phedra	Dupree	
Robenia	Duiged	
Rolando	Ion	
Sunny	Blake	
Sherlocke	Coie	
Tan	Gamil	
Virginie	Klemt	
*/

/* Show all the airplanes owned by the airline Jet Blue */

SELECT *
	FROM airplane
	WHERE airline_name = "Jet Blue";

/*
Execution Result:
airline_name	ID	seat_number	manufacturing_company	manufacturing_date	age	
Jet Blue	0	77	Livefish	2023-03-22	4	
Jet Blue	1	57	Photofeed	2023-03-27	3	
Jet Blue	2	66	Vimbo	2021-03-19	1	
Jet Blue	3	175	Teklist	2020-10-28	1	
Jet Blue	4	176	Skinder	2022-04-15	2	
Jet Blue	5	60	Aivee	2020-09-28	4	
Jet Blue	6	189	Voomm	2023-02-07	2	
Jet Blue	7	193	Babblestorm	2022-12-29	3	
Jet Blue	8	114	Livetube	2022-04-02	3	
Jet Blue	9	50	Skaboo	2020-09-22	2	
Jet Blue	10	57	Flipbug	2020-05-04	1	
Jet Blue	11	125	Twinder	2020-09-15	3	
Jet Blue	12	172	Dynazzy	2021-10-11	3	
Jet Blue	13	62	Devcast	2021-10-29	4	
*/
