import Header from "../components/Header";
import ShowFlightsCustomer from "../components/flights/ShowFlights";
import ShowFlightsStaff from "../components/staff/ShowFlights";
import Footer from "../components/Footer";
import useUser from "../hooks/useUser";

const Main = (props) => {
    const { user } = useUser();

    return (
        <div>
            <Header page="Home" />
            {user?.type === "staff" ? (
                <ShowFlightsStaff />
            ) : (
                <ShowFlightsCustomer />
            )}
            <Footer />
        </div>
    );
};

export default Main;
