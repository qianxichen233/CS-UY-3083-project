import styles from "./CustomerFlights.module.scss";

import FlightItem from "../flights/FlightItem";

const CustomerFlights = ({ flights }) => {
    return (
        <div className={styles.container}>
            {flights.map((flight) => {
                const key =
                    flight.airline_name +
                    flight.flight_number +
                    flight.departure_date;
                return <FlightItem key={key} flight={flight} selected />;
            })}
        </div>
    );
};

export default CustomerFlights;
