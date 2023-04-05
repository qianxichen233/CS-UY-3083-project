import axios from "axios";
import { useState } from "react";
import Form from "../UI/Form";

const AddPlane = () => {
    const [info, setInfo] = useState({
        airline_name: "",
        id: "",
        seat_number: "",
        manufacturing_company: "",
        manufacturing_date: "",
        age: "",
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
                `http://${process.env.REACT_APP_backend_baseurl}/api/airplane`,
                {
                    airline_name: info.airline_name,
                    ID: info.id,
                    seat_number: info.seat_number,
                    manufacturing_company: info.manufacturing_company,
                    manufacturing_date: info.manufacturing_date,
                    age: info.age,
                },
                { withCredentials: true }
            );

            setInfo({
                airline_name: "",
                id: "",
                seat_number: "",
                manufacturing_company: "",
                manufacturing_date: "",
                age: "",
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
                        label: "ID",
                        value: info.id,
                        onChange: onInfoChange.bind(null, "id"),
                        required: "ID is Required",
                    },
                    {
                        type: "text",
                        label: "Seat Number",
                        value: info.seat_number,
                        onChange: onInfoChange.bind(null, "seat_number"),
                        required: "Seat Number is Required",
                    },
                    {
                        type: "text",
                        label: "Manu. Company",
                        value: info.manufacturing_company,
                        onChange: onInfoChange.bind(
                            null,
                            "manufacturing_company"
                        ),
                        required: "Manufacturing Company is Required",
                    },
                    {
                        type: "date",
                        label: "Manu. Date",
                        value: info.manufacturing_date,
                        onChange: onInfoChange.bind(null, "manufacturing_date"),
                        required: "Manufacturing Date is Required",
                    },
                    {
                        type: "number",
                        label: "Age",
                        value: info.age,
                        onChange: onInfoChange.bind(null, "age"),
                        required: "Age is Required",
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

export default AddPlane;
