CREATE TABLE airline (name VARCHAR(50), PRIMARY KEY(name));

CREATE TABLE airline_staff (
    username VARCHAR(100),
    password VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    airline_name VARCHAR(50) NOT NULL,
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
    ID INT,
    seat_number INT NOT NULL,
    manufacturing_company VARCHAR(50) NOT NULL,
    manufacturing_date DATE NOT NULL,
    age INT NOT NULL,
    PRIMARY KEY(airline_name, ID),
    FOREIGN KEY(airline_name) REFERENCES airline(name)
);

CREATE TABLE airport (
    code VARCHAR(10),
    name VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    country VARCHAR(50) NOT NULL,
    airport_type VARCHAR(10) NOT NULL,
    PRIMARY KEY(code)
);

CREATE TABLE flight (
    airline_name VARCHAR(50),
    flight_number INT,
    departure_date_time DATETIME,
    departure_airport_code VARCHAR(10) NOT NULL,
    arrival_date_time DATETIME NOT NULL,
    arrival_airport_code VARCHAR(10) NOT NULL,
    base_price NUMERIC(10, 2) NOT NULL,
    airplane_ID INT NOT NULL,
    status VARCHAR(20) NOT NULL,
    PRIMARY KEY(
        airline_name,
        flight_number,
        departure_date_time
    ),
    FOREIGN KEY(departure_airport_code) REFERENCES airport(code),
    FOREIGN KEY(arrival_airport_code) REFERENCES airport(code),
    FOREIGN KEY(airline_name, airplane_ID) REFERENCES airplane(airline_name, ID),
    CHECK (status in ("scheduled", "ontime", "delayed", "departed", "arrived"))
);

CREATE TABLE customer (
    email VARCHAR(30),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    building_number INT NOT NULL,
    street_name VARCHAR(100) NOT NULL,
    apartment_number VARCHAR(20) NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    passport_number VARCHAR(20) NOT NULL,
    passport_expiration DATE NOT NULL,
    passport_country VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    PRIMARY KEY(email)
);

CREATE TABLE ticket (
    ID INT,
    airline_name VARCHAR(50) NOT NULL,
    flight_number INT NOT NULL,
    departure_date_time DATETIME NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    calculated_price NUMERIC(10, 2) NOT NULL,
    email VARCHAR(30) NOT NULL,
    purchased_date_time DATETIME NOT NULL,
    card_type VARCHAR(10) NOT NULL,
    card_number VARCHAR(20) NOT NULL,
    card_name VARCHAR(200) NOT NULL,
    expiration_date DATE NOT NULL,
    PRIMARY KEY(ID),
    FOREIGN KEY(
        airline_name,
        flight_number,
        departure_date_time
    ) REFERENCES flight(
        airline_name,
        flight_number,
        departure_date_time
    ),
    FOREIGN KEY(airline_name) REFERENCES airline(name),
    FOREIGN KEY(email) REFERENCES customer(email)
);

CREATE TABLE rate (
    email VARCHAR(30),
    airline_name VARCHAR(50),
    flight_number INT,
    departure_date_time DATETIME,
    rating NUMERIC(2, 1) NOT NULL,
    comment VARCHAR(10000),
    PRIMARY KEY(
        email,
        airline_name,
        flight_number,
        departure_date_time
    ),
    FOREIGN KEY(
        airline_name,
        flight_number,
        departure_date_time
    ) REFERENCES flight(
        airline_name,
        flight_number,
        departure_date_time
    ),
    FOREIGN KEY(airline_name) REFERENCES airline(name)
);