import { useState } from "react";
import FlightResult from "./FlightResult";
import useUser from "../../hooks/useUser";
import Button from "../UI/Button";

import styles from "./FlightsSubpage.module.scss";
import TicketForm from "./TicketForm";
import axios from "axios";

const selectedOne = (selectedFlights) => {
    return selectedFlights.reduce((prev, cur) => {
        return prev || cur;
    }, false);
};

const getSelectIndex = (selectedFlights) => {
    for (let i = 0; i < selectedFlights.length; ++i)
        if (selectedFlights[i]) return i;
};

const FlightsSubpage = (props) => {
    const { user } = useUser();

    const [ticketForm, setTicketForm] = useState(false);
    const [success, setSuccess] = useState("");

    const [selectedFromFlights, setSelectedFromFlights] = useState(
        Array(props.flights.flights_from.length).fill(false)
    );
    const [selectedToFlights, setSelectedToFlights] = useState(
        Array(props.flights.flights_to.length).fill(false)
    );

    const onSelectFromHandler = (index) => {
        const newState = Array(props.flights.flights_from.length).fill(false);
        newState[index] = true;
        setSelectedFromFlights(newState);
    };

    const onDeselectFromHandler = (index) => {
        setSelectedFromFlights((prev) => {
            const newState = [...prev];
            newState[index] = false;
            return newState;
        });
    };

    const onSelectToHandler = (index) => {
        const newState = Array(props.flights.flights_to.length).fill(false);
        newState[index] = true;
        setSelectedToFlights(newState);
    };

    const onDeselectToHandler = (index) => {
        setSelectedToFlights((prev) => {
            const newState = [...prev];
            newState[index] = false;
            return newState;
        });
    };

    const proceedable =
        selectedOne(selectedFromFlights) &&
        (!props.flights.flights_from || selectedOne(selectedToFlights));

    const onPurchaseHandler = async (cards) => {
        if (!user) return;

        const fromIndex = getSelectIndex(selectedFromFlights);
        const toIndex = getSelectIndex(selectedToFlights);

        const body = {
            type: !!props.flights.flights_from ? "round-trip" : "one-way",
            email: user.email,
            card_type: cards.card_type,
            card_number: cards.card_number,
            card_name: cards.card_name,
            expiration_date: cards.card_expiration,
        };

        if (toIndex) {
            body["to"] = {
                airline_name: props.flights.flights_to[toIndex].airline,
                flight_number: props.flights.flights_to[toIndex].flight_number,
                arrival_date: props.flights.flights_to[toIndex].arrival_date,
                departure_date:
                    props.flights.flights_to[toIndex].departure_date,
            };
        }
        if (fromIndex) {
            body["from"] = {
                airline_name: props.flights.flights_from[fromIndex].airline,
                flight_number:
                    props.flights.flights_from[fromIndex].flight_number,
                arrival_date:
                    props.flights.flights_from[fromIndex].arrival_date,
                departure_date:
                    props.flights.flights_from[fromIndex].departure_date,
            };
        }

        let result;

        try {
            const result = axios.put(
                `http://${process.env.REACT_APP_backend_baseurl}/api/tickets/register`,
                body,
                {
                    withCredentials: true,
                }
            );

            console.log(result);

            setSuccess("Success!");
            setTimeout(() => {
                window.location = "/?tab=myflight";
            }, 3000);
        } catch {
            console.log(result.data.msg);
        }
    };

    return (
        <div className={styles.container}>
            <FlightResult
                flights={props.flights}
                onSelectFromHandler={onSelectFromHandler}
                onDeselectFromHandler={onDeselectFromHandler}
                onSelectToHandler={onSelectToHandler}
                onDeselectToHandler={onDeselectToHandler}
                selectedFromFlights={selectedFromFlights}
                selectedToFlights={selectedToFlights}
            />
            {!!user && !ticketForm && (
                <div className={styles.checkout}>
                    <Button
                        text="Continue to Check Out"
                        disabled={!proceedable}
                        onClick={setTicketForm.bind(null, true)}
                    />
                </div>
            )}
            {!!ticketForm && (
                <TicketForm
                    disabled={!proceedable}
                    onPurchase={onPurchaseHandler}
                />
            )}
            {!!success && <div className={styles.success}>{success}</div>}
        </div>
    );
};

export default FlightsSubpage;
