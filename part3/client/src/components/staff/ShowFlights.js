import { useEffect, useState } from "react";

import axios from "axios";

import styles from "../flights/ShowFlight.module.scss";
import Search from "./Search";
import FlightsSubpage from "./FlightsSubpage";
import ShowCustomers from "./ShowCustomers";
import CustomerFlights from "./CustomerFlights";
import useUser from "../../hooks/useUser";

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
        price: "120.9$",
        purchased_date: "14, Mar 2023",
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
        price: "99.9$",
        purchased_date: "12, Mar 2023",
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

const ShowFlights = (props) => {
    const { user } = useUser();
    const [result, setResult] = useState();

    const getInitialResult = async () => {
        try {
            const result = await axios.get(
                `http://${process.env.REACT_APP_backend_baseurl}/api/flights`,
                {
                    params: {
                        airline: user.airline,
                        start_date: new Date().toLocaleDateString("en-us", {
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                        }),
                        end_date: new Date(
                            new Date().setDate(new Date().getDate() + 30)
                        ).toLocaleDateString("en-us", {
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                        }),
                    },
                    withCredentials: true,
                }
            );

            setResult({
                type: "flight",
                content: result.data.flights,
            });
        } catch (e) {
            console.error(e.response?.data.msg);
        }
    };

    const onSearchHandler = async (search_body) => {
        if (user.type !== "staff") return;

        const { type, body } = search_body;
        if (type === "flight_search") {
            const params = {
                airline: user.airline,
            };

            if (body.from) params["start_date"] = body.from;
            if (body.to) params["end_date"] = body.to;
            if (body.source.value) {
                if (body.source.type === "city")
                    params["source_city"] = body.source.value;
                else if (body.source.type === "airport")
                    params["source_airport"] = body.source.value;
            }
            if (body.target.value) {
                if (body.source.type === "city")
                    params["destination_city"] = body.source.value;
                else if (body.source.type === "airport")
                    params["destination_airport"] = body.source.value;
            }

            try {
                const result = await axios.get(
                    `http://${process.env.REACT_APP_backend_baseurl}/api/flights`,
                    {
                        params: params,
                        withCredentials: true,
                    }
                );

                setResult({
                    type: "flight",
                    content: result.data.flights,
                });
            } catch (e) {
                console.error(e.response?.data.msg);
            }
        } else if (type === "customer") {
            try {
                const result = await axios.get(
                    `http://${process.env.REACT_APP_backend_baseurl}/api/customer/all`,
                    {
                        params: {
                            airline: body.airline,
                            flight_number: body.flight_number,
                            departure_date: body.departure_date,
                        },
                        withCredentials: true,
                    }
                );

                setResult({
                    type: "customer",
                    content: result.data.customers,
                });
            } catch (e) {
                console.error(e.response?.data.msg);
            }
        } else if (type === "customer_flight") {
            try {
                const result = await axios.get(
                    `http://${process.env.REACT_APP_backend_baseurl}/api/flights/schedule`,
                    {
                        params: {
                            email: body.email,
                            airline: body.airline,
                        },
                        withCredentials: true,
                    }
                );

                setResult({
                    type: "customer_flight",
                    content: result.data.flights,
                });
            } catch (e) {
                console.error(e.response?.data.msg);
            }
        }
    };

    const onChange = (type) => {
        if (type === "flight") getInitialResult();
        else setResult(null);
    };

    const renderResult = (result) => {
        if (!result) return null;
        if (result.type === "flight")
            return <FlightsSubpage flights={result.content} />;
        else if (result.type === "customer")
            return <ShowCustomers info={result.content} />;
        else if (result.type == "customer_flight")
            return <CustomerFlights flights={result.content} />;
    };

    return (
        <div className={styles.container}>
            <Search onSearch={onSearchHandler} onChange={onChange} />
            {renderResult(result)}
        </div>
    );
};

export default ShowFlights;
