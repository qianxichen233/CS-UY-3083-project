import { useState } from "react";
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
        status: "delayed",
        airplane: {
            id: "id",
            seat_number: "seat_number",
            manufacturing_company: "manufacturing_company",
            manufacturing_date: "manufacturing_date",
            age: "age",
        },
    },
};

const ShowFlightStatus = (props) => {
    const [filter, setFilter] = useState({
        airline_name: "",
        flight_number: "",
        arrival_date: "",
        departure_date: "",
    });

    const [flight, setFlight] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const onFilterChange = (property, value) => {
        setFilter((prev) => {
            const newState = { ...prev };
            newState[property] = value;
            return newState;
        });
    };

    const onSubmitHandler = async () => {
        const query = createQuery({
            append: {
                ...filter,
            },
        });

        let result = dummy;
        //fetch(`${process.env.backend_baseurl}/api/flight_status?${query}`);

        setFlight(result);
    };

    return (
        <div>
            <Form
                inputs={[
                    {
                        type: "text",
                        label: "airline name",
                        value: filter.airline_name,
                        onChange: onFilterChange.bind(null, "airline_name"),
                    },
                    {
                        type: "text",
                        label: "flight nubmer",
                        value: filter.flight_number,
                        onChange: onFilterChange.bind(null, "flight_number"),
                    },
                    {
                        type: "date",
                        label: "arrival date",
                        value: filter.arrival_date,
                        onChange: onFilterChange.bind(null, "arrival_date"),
                    },
                    {
                        type: "date",
                        label: "departure date",
                        value: filter.departure_date,
                        onChange: onFilterChange.bind(null, "departure_date"),
                    },
                ]}
                submit={{
                    onSubmit: onSubmitHandler,
                    text: "submit",
                }}
            />
            {flight && <FlightItem flight={flight} />}
        </div>
    );
};

export default ShowFlightStatus;
