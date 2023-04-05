import axios from "axios";
import { useState } from "react";
import Form from "../UI/Form";

const AddFlight = () => {
    const [info, setInfo] = useState({
        airline_name: "",
        flight_number: "",
        departure_date: "",
        departure_time: "",
        departure_airport_code: "",
        arrival_date: "",
        arrival_time: "",
        arrival_airport_code: "",
        base_price: "",
        airplane_id: "",
    });

    const onInfoChange = (property, value) => {
        setInfo((prev) => {
            const newState = { ...prev };
            newState[property] = value;
            return newState;
        });
    };

    const onAddHandler = async () => {
        let result;
        try {
            result = await axios.put(
                `http://${process.env.REACT_APP_backend_baseurl}/api/flights`,
                { ...info },
                { withCredentials: true }
            );

            setInfo({
                airline_name: "",
                flight_number: "",
                departure_date: "",
                departure_time: "",
                departure_airport_code: "",
                arrival_date: "",
                arrival_time: "",
                arrival_airport_code: "",
                base_price: "",
                airplane_id: "",
            });
        } catch (e) {
            console.error(e.response?.data.msg);
        }
    };

    return (
        <div
            style={{
                padding: "20px",
            }}
        >
            <Form
                column="2"
                inputs={[
                    {
                        type: "text",
                        label: "Airline Name",
                        value: info.airline_name,
                        onChange: onInfoChange.bind(null, "airline_name"),
                        required: "Airline Name is Required",
                    },
                    {
                        type: "text",
                        label: "Flight Number",
                        value: info.flight_number,
                        onChange: onInfoChange.bind(null, "flight_number"),
                        required: "Flight Number is Required",
                    },
                    {
                        type: "date",
                        label: "Departure Date",
                        value: info.departure_date,
                        onChange: onInfoChange.bind(null, "departure_date"),
                        required: "Departure Date is Required",
                    },
                    {
                        type: "time",
                        label: "Departure Time",
                        value: info.departure_time,
                        onChange: onInfoChange.bind(null, "departure_time"),
                        required: "Departure Time is Required",
                    },
                    {
                        type: "text",
                        label: "Depart. Port Code",
                        value: info.departure_airport_code,
                        onChange: onInfoChange.bind(
                            null,
                            "departure_airport_code"
                        ),
                        required: "Depart. Port Code is Required",
                    },
                    {
                        type: "text",
                        label: "Arrival Date",
                        value: info.arrival_date,
                        onChange: onInfoChange.bind(null, "arrival_date"),
                        required: "Arrival Date is Required",
                    },
                    {
                        type: "time",
                        label: "Arrival Time",
                        value: info.arrival_time,
                        onChange: onInfoChange.bind(null, "arrival_time"),
                        required: "Arrival Time is Required",
                    },
                    {
                        type: "text",
                        label: "Arrival Port Code",
                        value: info.arrival_airport_code,
                        onChange: onInfoChange.bind(
                            null,
                            "arrival_airport_code"
                        ),
                        required: "Arrival Port Code is Required",
                    },
                    {
                        type: "text",
                        label: "Base Price",
                        value: info.base_price,
                        onChange: onInfoChange.bind(null, "base_price"),
                        required: "Base Price is Required",
                    },
                    {
                        type: "text",
                        label: "Airplane ID",
                        value: info.airplane_id,
                        onChange: onInfoChange.bind(null, "airplane_id"),
                        required: "Airplane ID is Required",
                    },
                ]}
                submit={{
                    text: "Add",
                    onClick: onAddHandler,
                }}
            />
        </div>
    );
};

export default AddFlight;
