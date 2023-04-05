import axios from "axios";
import { useState } from "react";
import Form from "../UI/Form";

const AddPort = () => {
    const [info, setInfo] = useState({
        code: "",
        name: "",
        city: "",
        country: "",
        airport_type: "",
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
                `http://${process.env.REACT_APP_backend_baseurl}/api/airport`,
                {
                    code: info.code,
                    name: info.name,
                    city: info.city,
                    country: info.country,
                    airport_type: info.airport_type,
                },
                { withCredentials: true }
            );

            setInfo({
                code: "",
                name: "",
                city: "",
                country: "",
                airport_type: "",
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
                        label: "Code",
                        value: info.code,
                        onChange: onInfoChange.bind(null, "code"),
                        required: "Code Number is Required",
                    },
                    {
                        type: "text",
                        label: "Name",
                        value: info.name,
                        onChange: onInfoChange.bind(null, "name"),
                        required: "Name is Required",
                    },
                    {
                        type: "text",
                        label: "City",
                        value: info.city,
                        onChange: onInfoChange.bind(null, "city"),
                        required: "City is Required",
                    },
                    {
                        type: "text",
                        label: "Country",
                        value: info.country,
                        onChange: onInfoChange.bind(null, "country"),
                        required: "Country is Required",
                    },
                    {
                        type: "text",
                        label: "Airport Type",
                        value: info.airport_type,
                        onChange: onInfoChange.bind(null, "airport_type"),
                        required: "Airport Type is Required",
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

export default AddPort;
