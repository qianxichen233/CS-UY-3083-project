import { useEffect, useState } from "react";

import axios from "axios";

import styles from "../flights/ShowFlight.module.scss";
import Search from "./Search";
import FlightsSubpage from "./FlightsSubpage";

const dummy_customer = [
    {
        address: {
            apartment_number: "1",
            building_number: 1,
            city: "New York",
            state: "New York",
            street_name: "Jay St.",
            zip_code: "11201",
        },
        date_of_birth: "Sat, 01 Jan 2000 00:00:00 GMT",
        email: "qc815@nyu.edu",
        first_name: "Qianxi",
        last_name: "Chen",
        phone_numbers: ["123-456-789"],
        passport: {
            country: "China",
            expiration: "Wed, 31 Dec 2025 00:00:00 GMT",
            number: "12345",
        },
    },
    {
        address: {
            apartment_number: "2",
            building_number: 1,
            city: "New York",
            state: "New York",
            street_name: "Jay St.",
            zip_code: "11201",
        },
        date_of_birth: "Sat, 01 Jan 2000 00:00:00 GMT",
        email: "qc815@nyu.edu",
        first_name: "Qianxi",
        last_name: "Chen",
        phone_numbers: ["123-456-789"],
        passport: {
            country: "China",
            expiration: "Wed, 31 Dec 2025 00:00:00 GMT",
            number: "12345",
        },
    },
];

const dummy_myflights = [
    {
        airline_name: "ABC Airline",
        flight_number: "12345",
        departure_date: "Fri, 24 May 2023",
        departure_time: "12:20",
        departure_airport_code: "ABC",
        arrival_date: "Fri, 24 May 2023",
        arrival_time: "16:40",
        arrival_airport_code: "CBA",
        base_price: "99.9$",
        actual_price: "139.9$",
        time: "4h 20m",
        status: "scheduled",
        airplane: {
            id: "10001",
            seat_number: "100",
            manufacturing_company: "Apple",
            manufacturing_date: "2021-01-01",
            age: "2",
        },
    },
    {
        airline_name: "AAA Airline",
        flight_number: "54321",
        departure_date: "Fri, 13 Mar 2023",
        departure_time: "12:20",
        departure_airport_code: "CBA",
        arrival_date: "Fri, 13 Mar 2023",
        arrival_time: "16:50",
        arrival_airport_code: "ABC",
        base_price: "109.9$",
        actual_price: "109.9$",
        time: "4h 30m",
        status: "departed",
        airplane: {
            id: "10002",
            seat_number: "90",
            manufacturing_company: "Banana",
            manufacturing_date: "2022-05-02",
            age: "1",
        },
    },
    {
        airline_name: "AAA Airline",
        flight_number: "54321",
        departure_date: "Fri, 19 Feb 2023",
        departure_time: "14:20",
        departure_airport_code: "CBA",
        arrival_date: "Fri, 19 Feb 2023",
        arrival_time: "18:50",
        arrival_airport_code: "ABC",
        base_price: "109.9$",
        actual_price: "109.9$",
        time: "4h 30m",
        status: "arrived",
        airplane: {
            id: "10002",
            seat_number: "90",
            manufacturing_company: "Banana",
            manufacturing_date: "2022-05-02",
            age: "1",
        },
    },
];

const convertFlights = (flights) => {
    flights.sort((a, b) => {
        return (
            new Date(b.departure_date + " " + b.departure_time) -
            new Date(a.departure_date + " " + a.departure_time)
        );
    });

    const converted = {
        future: [],
        ongoing: [],
        past: [],
    };

    for (const flight of flights) {
        const one_day_before = new Date(
            new Date(flight.departure_date + " " + flight.departure_time) - 1
        );
        const arrival_date = new Date(
            flight.arrival_date + " " + flight.arrival_time
        );
        if (one_day_before > new Date()) converted.future.push(flight);
        else if (arrival_date < new Date()) converted.past.push(flight);
        else converted.ongoing.push(flight);
    }

    return converted;
};

const ShowFlights = (props) => {
    const [result, setResult] = useState();

    const onSearchHandler = async (search_body) => {
        console.log(search_body);
    };

    useEffect(() => {
        setResult({
            type: "flight",
            content: dummy_myflights,
        });
    }, []);

    return (
        <div className={styles.container}>
            <Search onSearch={onSearchHandler} />
            {!!result && <FlightsSubpage flights={result.content} />}
        </div>
    );
};

export default ShowFlights;
