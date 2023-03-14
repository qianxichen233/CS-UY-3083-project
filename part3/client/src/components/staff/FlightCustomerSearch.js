import { useState } from "react";
import Form from "../UI/Form";

import styles from "../flights/StatusSearch.module.scss";

const FlightCustomerSearch = (props) => {
    const [filter, setFilter] = useState({
        airline: "",
        flight_number: "",
        departure: "",
    });

    const onFilterChange = (property, value) => {
        setFilter((prev) => {
            const newState = { ...prev };
            newState[property] = value;
            return newState;
        });
    };

    const onSearchHandler = () => {
        props.onSearch({
            type: "customer",
            body: {
                airline: filter.airline,
                flight_number: filter.flight_number,
                departure: filter.departure,
            },
        });
    };

    return (
        <div className={styles.container}>
            <main>
                <Form
                    column="2"
                    inputs={[
                        {
                            type: "text",
                            label: "Airline Name",
                            value: filter.airline,
                            onChange: onFilterChange.bind(null, "airline"),
                            required: "Airline Name is Required",
                        },
                        {
                            type: "text",
                            label: "Flight Number",
                            value: filter.flight_number,
                            onChange: onFilterChange.bind(
                                null,
                                "flight_number"
                            ),
                            required: "Flight Number is Required",
                        },
                        {
                            type: "date",
                            label: "Departure Date",
                            value: filter.departure,
                            onChange: onFilterChange.bind(null, "departure"),
                            required: "Departure Date is Required",
                        },
                    ]}
                    submit={{
                        text: "Search",
                        onClick: onSearchHandler,
                    }}
                />
            </main>
        </div>
    );
};

export default FlightCustomerSearch;
