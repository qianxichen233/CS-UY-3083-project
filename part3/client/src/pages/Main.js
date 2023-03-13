import Header from "../components/Header";
import ShowFlights from "../components/flights/ShowFlights";
import Footer from "../components/Footer";

const Main = (props) => {
    return (
        <div>
            <Header page="Home" />
            <ShowFlights />
            <Footer />
        </div>
    );
};

export default Main;
