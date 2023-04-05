import axios from "axios";
import { Fragment, useState } from "react";
import useUser from "../../hooks/useUser";
import DisplayComment from "../comment/DisplayComment";
import MakeComment from "../comment/MakeComment";
import Button from "../UI/Button";
import FlightItem from "./FlightItem";
import styles from "./MyFlightsSubpage.module.scss";

const MyFlightsSubpage = ({ flights }) => {
    const { user } = useUser();
    const [selected, setSelected] = useState(
        Array(
            flights.future.length + flights.ongoing.length + flights.past.length
        ).fill(false)
    );

    const onSelectHandler = (index) => {
        const newState = Array(flights.length).fill(false);
        newState[index] = true;
        setSelected(newState);
    };

    const onDeselectHandler = (index) => {
        setSelected((prev) => {
            const newState = [...prev];
            newState[index] = false;
            return newState;
        });
    };

    const onUnregisterHandler = async (index) => {
        try {
            const result = await axios.post(
                `http://${process.env.REACT_APP_backend_baseurl}/api/tickets/unregister`,
                {
                    email: user.email,
                    airline_name: flights.future[index].airline_name,
                    flight_number: flights.future[index].flight_number,
                    arrival_date: flights.future[index].arrival_date,
                    departure_date: flights.future[index].departure_date,
                },
                { withCredentials: true }
            );

            window.location = "/?tab=myflight";
        } catch (e) {
            console.error(e.response?.data.msg);
        }
    };

    return (
        <div className={styles.container}>
            {flights.future.length > 0 && (
                <div className={styles.division}>
                    <span>My Future Flights</span>
                </div>
            )}
            {flights.future.map((flight, index) => {
                const key =
                    flight.airline_name +
                    flight.flight_number +
                    flight.departure_date;

                return (
                    <Fragment key={key}>
                        <FlightItem
                            flight={flight}
                            selected={selected[index]}
                            onSelect={onSelectHandler.bind(null, index)}
                            onDeselect={onDeselectHandler.bind(null, index)}
                            showStatus={false}
                            selectable={true}
                            calculatedPrice={flight.actual_price}
                        />
                        {selected[index] && (
                            <Button
                                text="Unregister"
                                color="#041BD7"
                                onClick={onUnregisterHandler.bind(null, index)}
                            />
                        )}
                    </Fragment>
                );
            })}
            {flights.ongoing.length > 0 && (
                <div className={styles.division}>
                    <span>My Ongoing Flights</span>
                </div>
            )}
            {flights.ongoing.map((flight, index) => {
                const key =
                    flight.airline_name +
                    flight.flight_number +
                    flight.departure_date;

                const baseIndex = flights.future.length + index;

                return (
                    <FlightItem
                        key={key}
                        flight={flight}
                        selected={selected[baseIndex]}
                        onSelect={onSelectHandler.bind(null, baseIndex)}
                        onDeselect={onDeselectHandler.bind(null, baseIndex)}
                        showStatus={true}
                        selectable={false}
                        calculatedPrice={flight.actual_price}
                    />
                );
            })}
            {flights.past.length > 0 && (
                <div className={styles.division}>
                    <span>My Past Flights</span>
                </div>
            )}
            {flights.past.map((flight, index) => {
                const key =
                    flight.airline_name +
                    flight.flight_number +
                    flight.departure_date;

                const baseIndex =
                    flights.future.length + flights.ongoing.length + index;

                return (
                    <Fragment key={key}>
                        <FlightItem
                            flight={flight}
                            selected={selected[baseIndex]}
                            onSelect={onSelectHandler.bind(null, baseIndex)}
                            onDeselect={onDeselectHandler.bind(null, baseIndex)}
                            showStatus={false}
                            selectable={true}
                            calculatedPrice={flight.actual_price}
                        />
                        {selected[baseIndex] &&
                            (flight.comment ? (
                                <div className={styles.comment}>
                                    <span>My Comment:</span>
                                    <DisplayComment comment={flight.comment} />
                                </div>
                            ) : (
                                <div className={styles.comment}>
                                    <span>Make a Comment:</span>
                                    <MakeComment
                                        airline_name={flight.airline_name}
                                        flight_number={flight.flight_number}
                                        arrival_date={flight.arrival_date}
                                        departure_date={flight.departure_date}
                                    />
                                </div>
                            ))}
                    </Fragment>
                );
            })}
        </div>
    );
};

export default MyFlightsSubpage;
