import { useState } from "react";

import axios from "axios";

import styles from "./ShowFlight.module.scss";
import useUser from "../../hooks/useUser";
import Search from "./Search";
import FlightsSubpage from "./FlightsSubpage";
import StatusSubpage from "./StatusSubpage";
import MyFlightsSubpage from "./MyFlightsSubpage";

const dummy = {
    flights_to: [
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
            status: "delayed",
            airplane: {
                id: "10001",
                seat_number: "100",
                manufacturing_company: "Apple",
                manufacturing_date: "2021-01-01",
                age: "2",
            },
        },
    ],
    flights_from: [
        {
            airline_name: "AAA Airline",
            flight_number: "54321",
            departure_date: "Fri, 29 May 2023",
            departure_time: "14:20",
            departure_airport_code: "CBA",
            arrival_date: "Fri, 29 May 2023",
            arrival_time: "18:50",
            arrival_airport_code: "ABC",
            base_price: "109.9$",
            actual_price: "109.9$",
            time: "4h 30m",
            status: "delayed",
            airplane: {
                id: "10002",
                seat_number: "90",
                manufacturing_company: "Banana",
                manufacturing_date: "2022-05-02",
                age: "1",
            },
        },
    ],
};

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
        status: "delayed",
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
        departure_date: "Fri, 19 Feb 2023",
        departure_time: "14:20",
        departure_airport_code: "CBA",
        arrival_date: "Fri, 19 Feb 2023",
        arrival_time: "18:50",
        arrival_airport_code: "ABC",
        base_price: "109.9$",
        actual_price: "109.9$",
        time: "4h 30m",
        status: "delayed",
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
        departure_date: "Fri, 13 Mar 2023",
        departure_time: "12:20",
        departure_airport_code: "CBA",
        arrival_date: "Fri, 13 Mar 2023",
        arrival_time: "16:50",
        arrival_airport_code: "ABC",
        base_price: "109.9$",
        actual_price: "109.9$",
        time: "4h 30m",
        status: "delayed",
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
    const { user } = useUser();
    const [result, setResult] = useState();

    const onSearchHandler = async (search_body) => {
        const { type, body } = search_body;
        if (type === "flight_search") {
            const params = {};

            if (body.departure) params["departure_date"] = body.departure;
            if (body.return) params["return_date"] = body.return;
            if (body.from.value) {
                if (body.from.type === "city")
                    params["source_city"] = body.from.value;
                else if (body.from.type === "airport")
                    params["source_airport"] = body.from.value;
            }
            if (body.to.value) {
                if (body.to.type === "city")
                    params["destination_city"] = body.to.value;
                else if (body.to.type === "airport")
                    params["destination_airport"] = body.to.value;
            }

            try {
                const result = await axios.get(
                    `http://${process.env.REACT_APP_backend_baseurl}/api/flights/future`,
                    {
                        params: params,
                    }
                );

                setResult({
                    type: "flight",
                    content: result.data,
                });
            } catch (e) {
                console.error(e.response?.data.msg);
            }
        } else if (type === "status") {
            let result;
            try {
                result = await axios.get(
                    `http://${process.env.REACT_APP_backend_baseurl}/api/flights/status`,
                    {
                        params: {
                            airline_name: body.airline,
                            flight_number: body.flight_number,
                            departure_date: body.departure,
                        },
                    }
                );
                setResult({
                    type: "status",
                    content: result.data,
                });
            } catch (e) {
                console.error(e.response?.data.msg);
            }
        } else if (type === "myflight") {
            if (!user) return;
            const params = {
                email: user.email,
            };

            if (body.start_date) params["start_date"] = body.start_date;
            if (body.end_date) params["end_date"] = body.end_date;
            if (body.from.value) {
                if (body.from.type === "city")
                    params["source_city"] = body.from.value;
                else if (body.from.type === "airport")
                    params["source_airport"] = body.from.value;
            }
            if (body.to.value) {
                if (body.to.type === "city")
                    params["destination_city"] = body.to.value;
                else if (body.to.type === "airport")
                    params["destination_airport"] = body.to.value;
            }

            let result;
            try {
                result = await axios.get(
                    `http://${process.env.REACT_APP_backend_baseurl}/api/flights/schedule`,
                    {
                        params: params,
                    }
                );

                setResult({
                    type: "myflight",
                    content: result.data,
                });
            } catch (e) {
                console.error(e.response?.data.msg);
            }
        }
    };

    const renderSubpage = (result) => {
        if (result?.type === "flight")
            return <FlightsSubpage flights={result.content} />;
        else if (result?.type === "status")
            return <StatusSubpage flight={result.content} />;
        else if (result?.type === "myflight")
            return (
                <MyFlightsSubpage flights={convertFlights(result.content)} />
            );
        //return <FlightsSubpage flights={dummy} />;
    };

    return (
        <div className={styles.container}>
            <Search onSearch={onSearchHandler} />
            {renderSubpage(result)}
        </div>
    );
};

export default ShowFlights;
