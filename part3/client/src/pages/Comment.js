import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate, useSearchParams } from "react-router-dom";
import useUser from "../hooks/useUser";
import { useEffect, useState } from "react";
import FlightComments from "../components/staff/CommentPage/FlightComments";

const Comment = () => {
    const { user } = useUser();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [flight, setFlight] = useState();

    useEffect(() => {
        if (user?.type !== "staff") navigate("/");
        const airline = searchParams.get("airline");
        const flight_number = searchParams.get("flight");
        const departure_date = searchParams.get("departure");
        //if (airline !== user.airline) navigate("/");

        setFlight({
            airline,
            flight_number,
            departure_date,
        });
    }, [searchParams, user]);

    if (!flight) return;

    return (
        <div>
            <Header />
            <FlightComments flight={flight} />
            <Footer />
        </div>
    );
};

export default Comment;
