import axios from "axios";
import { useEffect, useState } from "react";
import CommentList from "./CommentList";
import CommentSearch from "./CommentSearch";

const dummy = [
    {
        author: "Qianxi Chen",
        rating: 4,
        comment: "Great experience",
    },
    {
        author: "Bob",
        rating: 5,
        comment: "good",
    },
    {
        author: "Alice",
        rating: 1,
        comment: "awful",
    },
];

const FlightComments = ({ flight: initalFlight }) => {
    const [flight, setFlight] = useState(initalFlight);
    const [comments, setComments] = useState([]);

    const onSearchHandler = (flight) => {
        setFlight({
            airline: flight.body.airline,
            flight_number: flight.body.flight_number,
            departure_date: flight.body.departure,
        });
    };

    const fetchComments = async (flight) => {
        try {
            const result = await axios.get(
                `http://${process.env.REACT_APP_backend_baseurl}/api/comment`,
                {
                    params: {
                        airline_name: flight.airline,
                        flight_number: flight.flight_number,
                        departure_date: flight.departure_date,
                    },
                    withCredentials: true,
                }
            );

            setComments(result.data.comments);
        } catch (e) {
            console.error(e.response?.data.msg);
        }
    };

    useEffect(() => {
        if (!flight) return;
        //fetchComments(flight);
        setComments(dummy);
    }, [flight]);

    return (
        <div>
            <CommentSearch onSearch={onSearchHandler} value={flight} />
            <CommentList comments={comments} />
        </div>
    );
};

export default FlightComments;
