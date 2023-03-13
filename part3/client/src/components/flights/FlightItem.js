import { useState } from "react";
import AirplaneIcon from "../UI/AirplaneIcon";
import Arrow from "../UI/Arrow";
import Checkbox from "../UI/Checkbox";
import styles from "./FlightItem.module.scss";

const FlightItem = ({ flight, onSelect, onDeselect, selected, selectable }) => {
    const onClickHandler = () => {
        if (!selectable || !onSelect || !onDeselect) return;
        if (!selected) onSelect();
        else onDeselect();
    };

    return (
        <div className={styles.flight}>
            <header>
                <div className={styles.icon}>
                    <AirplaneIcon />
                </div>
                <div>
                    <div className={styles.airports}>
                        <span>{flight.departure_airport_code}</span>
                        <Arrow width={2} length={70} />
                        <span>{flight.arrival_airport_code}</span>
                    </div>
                    <div>
                        <span>{flight.airline_name}</span>
                    </div>
                </div>
            </header>
            <main>
                {selectable && (
                    <div className={styles.select}>
                        <Checkbox
                            size={30}
                            checked={selected}
                            onClick={onClickHandler}
                            color="#FF7100"
                        />
                    </div>
                )}
                <div
                    className={styles.border}
                    style={{
                        backgroundColor: selected ? "#FF7100" : "",
                    }}
                ></div>
                <div
                    className={styles.content}
                    style={{
                        backgroundColor: selected ? "#FFF8E1" : "",
                    }}
                >
                    <div className={styles.flight_info}>
                        <div>
                            <span>{flight.departure_date}</span>
                            <span>{flight.departure_airport_code}</span>
                            <span>{flight.departure_time}</span>
                        </div>
                        <div className={styles.arrow}>
                            <Arrow
                                width={3}
                                length={170}
                                color="grey"
                                text={flight.time}
                            />
                        </div>
                        <div>
                            <span>{flight.arrival_date}</span>
                            <span>{flight.arrival_airport_code}</span>
                            <span>{flight.arrival_time}</span>
                        </div>
                    </div>
                    <div className={styles.airplane_info}>
                        <span>{flight.airplane.id}</span>
                        <AirplaneIcon />
                        <span>{flight.airplane.seat_number} Seats</span>
                    </div>
                    <div className={styles.price}>
                        <span className={styles.text}>Starts From</span>
                        <span>{flight.base_price}</span>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default FlightItem;
