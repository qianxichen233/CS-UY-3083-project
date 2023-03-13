import Search from "../components/flights/Search";
import Footer from "../components/Footer";
import Header from "../components/Header";

import axios from "axios";
import { useState } from "react";
import useUser from "../hooks/useUser";

const Main = (props) => {
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
            } catch {
                console.log(result.data.msg);
            }
        } else if (type === "status") {
            try {
                const result = await axios.get(
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
            } catch {
                console.log(result.data.msg);
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

            try {
                const result = await axios.get(
                    `http://${process.env.REACT_APP_backend_baseurl}/api/flights/schedule`,
                    {
                        params: params,
                    }
                );

                setResult({
                    type: "myflight",
                    content: result.data,
                });
            } catch {
                console.log(result.data.msg);
            }
        }
    };

    return (
        <div>
            <Header page="Home" />
            <Search onSearch={onSearchHandler} />
            <Footer />
        </div>
    );
};

export default Main;
