import { useEffect, useState } from "react";
import { createQuery } from "../../utility";
import Form from "../UI/Form";
import FlightItem from "./FlightItem";

const dummy = {
    to: {
        airline_name: "airline_name",
        flight_number: "flight_number",
        departure_date: "departure_date",
        departure_time: "departure_time",
        departure_airport_code: "departure_airport_code",
        arrival_date: "arrival_date",
        arrival_time: "arrival_time",
        arrival_airport_code: "arrival_airport_code",
        base_price: "base_price",
        airplane: {
            id: "id",
            seat_number: "seat_number",
            manufacturing_company: "manufacturing_company",
            manufacturing_date: "manufacturing_date",
            age: "age",
        },
    },
};

const exclusion = {
    source_city: "source_airport",
    source_airport: "source_city",
    destination_city: "destination_airport",
    destination_airport: "destination_city",
};

const ShowFlights = (props) => {
    const [filter, setFilter] = useState({
        source_city: "",
        source_airport: "",
        destination_city: "",
        destination_airport: "",
        departure_date: "",
        return_date: "",
    });

    const [flights, setFlights] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [initialLoading, setInitialLoading] = useState(false);

    const onFilterChange = (property, value) => {
        setFilter((prev) => {
            const newState = { ...prev };
            newState[property] = value;
            if (exclusion[property]) newState[exclusion[property]] = "";
            return newState;
        });
    };

    const fetchFlights = async (filter) => {
        setIsLoading(true);
        const query = createQuery({
            either: [
                {
                    source_city: filter.source_city,
                    source_airport: filter.source_airport,
                },
                {
                    destination_city: filter.destination_city,
                    destination_airport: filter.destination_airport,
                },
            ],
            append: {
                departure_date: filter.departure_date,
                return_date: filter.return_date,
            },
        });

        let result = [dummy];

        // const raw_result = await fetch(
        //     `${process.env.backend_baseurl}/api/future_flight?${query}`
        // );

        // result = await raw_result.json();
        setFlights(result);
        setIsLoading(false);
    };

    useEffect(() => {
        if (initialLoading) return;
        if (!filter) return;
        fetchFlights(filter);
        setInitialLoading(true);
    }, [initialLoading, filter]);

    return (
        <div>
            <Form
                inputs={[
                    {
                        type: "text",
                        label: "source city",
                        value: filter.source_city,
                        onChange: onFilterChange.bind(null, "source_city"),
                    },
                    {
                        type: "text",
                        label: "source airport",
                        value: filter.source_airport,
                        onChange: onFilterChange.bind(null, "source_airport"),
                    },
                    {
                        type: "text",
                        label: "destination city",
                        value: filter.destination_city,
                        onChange: onFilterChange.bind(null, "destination_city"),
                    },
                    {
                        type: "text",
                        label: "destination airport",
                        value: filter.destination_airport,
                        onChange: onFilterChange.bind(
                            null,
                            "destination_airport"
                        ),
                    },
                    {
                        type: "date",
                        label: "departure date",
                        value: filter.departure_date,
                        onChange: onFilterChange.bind(null, "departure_date"),
                    },
                    {
                        type: "date",
                        label: "return date",
                        value: filter.return_date,
                        onChange: onFilterChange.bind(null, "return_date"),
                    },
                ]}
                submit={{
                    onSubmit: fetchFlights.bind(null, filter),
                    text: "submit",
                }}
            />
            {flights.map((flight) => {
                if (!flight) return null;
                return (
                    <FlightItem
                        key={
                            flight.airline_name +
                            flight.flight_number +
                            flight.departure_date
                        }
                        flight={flight}
                    />
                );
            })}
        </div>
    );
};

export default ShowFlights;
