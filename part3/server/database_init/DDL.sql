CREATE TABLE airline (name VARCHAR(50), PRIMARY KEY(name));

CREATE TABLE airline_staff (
    username VARCHAR(100),
    password VARCHAR(100),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    date_of_birth DATE,
    airline_name VARCHAR(50),
    PRIMARY KEY(username),
    FOREIGN KEY(airline_name) REFERENCES airline(name)
);

CREATE TABLE airline_staff_phone_number (
    username VARCHAR(100),
    phone_number VARCHAR(20),
    PRIMARY KEY(username, phone_number),
    FOREIGN KEY(username) REFERENCES airline_staff(username)
);

CREATE TABLE airline_staff_email_address (
    username VARCHAR(100),
    email_address VARCHAR(30),
    PRIMARY KEY(username, email_address),
    FOREIGN KEY(username) REFERENCES airline_staff(username)
);

CREATE TABLE airplane (
    airline_name VARCHAR(50),
    ID NUMERIC(10, 0),
    seat_number NUMERIC(5, 0),
    manufacturing_company VARCHAR(50),
    manufacturing_date DATE,
    age NUMERIC(4, 0),
    PRIMARY KEY(airline_name, ID),
    FOREIGN KEY(airline_name) REFERENCES airline(name)
);

CREATE TABLE airport (
    code VARCHAR(10),
    name VARCHAR(50),
    city VARCHAR(50),
    country VARCHAR(50),
    airport_type VARCHAR(10),
    PRIMARY KEY(code)
);

CREATE TABLE flight (
    airline_name VARCHAR(50),
    flight_number NUMERIC(10, 0),
    departure_date DATE,
    departure_time TIME,
    departure_airport_code VARCHAR(10),
    arrival_date DATE,
    arrival_time TIME,
    arrival_airport_code VARCHAR(10),
    base_price NUMERIC(10, 2),
    airplane_ID NUMERIC(10, 0),
    PRIMARY KEY(
        airline_name,
        flight_number,
        departure_date,
        departure_time
    ),
    FOREIGN KEY(departure_airport_code) REFERENCES airport(code),
    FOREIGN KEY(arrival_airport_code) REFERENCES airport(code),
    FOREIGN KEY(airline_name, airplane_ID) REFERENCES airplane(airline_name, ID)
);

CREATE TABLE customer (
    email VARCHAR(30),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    password VARCHAR(100),
    building_number INT,
    street_name VARCHAR(100),
    apartment_number VARCHAR(20),
    city VARCHAR(50),
    state VARCHAR(50),
    zip_code VARCHAR(10),
    passport_number VARCHAR(20),
    passport_expiration DATE,
    passport_country VARCHAR(50),
    date_of_birth DATE,
    PRIMARY KEY(email)
);

CREATE TABLE ticket (
    ID INT,
    airline_name VARCHAR(50),
    flight_number NUMERIC(10, 0),
    departure_date DATE,
    departure_time TIME,
    email VARCHAR(30),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    date_of_birth DATE,
    calculated_price NUMERIC(10, 2),
    PRIMARY KEY(ID),
    FOREIGN KEY(
        airline_name,
        flight_number,
        departure_date,
        departure_time
    ) REFERENCES flight(
        airline_name,
        flight_number,
        departure_date,
        departure_time
    ),
    FOREIGN KEY(airline_name) REFERENCES airline(name)
);

CREATE TABLE purchased (
    ID INT,
    email VARCHAR(30),
    purchased_date DATE,
    purchased_time TIME,
    card_type VARCHAR(10),
    card_number VARCHAR(20),
    name VARCHAR(200),
    expiration_date DATE,
    PRIMARY KEY(ID, email, purchased_date, purchased_time),
    FOREIGN KEY(ID) REFERENCES ticket(ID),
    FOREIGN KEY(email) REFERENCES customer(email)
);

CREATE TABLE rate (
    email VARCHAR(30),
    airline_name VARCHAR(50),
    flight_number NUMERIC(10, 0),
    departure_date DATE,
    departure_time TIME,
    rating NUMERIC(3, 1),
    comment VARCHAR(10000),
    PRIMARY KEY(
        email,
        airline_name,
        flight_number,
        departure_date,
        departure_time
    ),
    FOREIGN KEY(
        airline_name,
        flight_number,
        departure_date,
        departure_time
    ) REFERENCES flight(
        airline_name,
        flight_number,
        departure_date,
        departure_time
    ),
    FOREIGN KEY(airline_name) REFERENCES airline(name)
);