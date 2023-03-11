const FlightItem = (props) => {
    return (
        <div>
            <span>{props.flight.to.airline_name}</span>
        </div>
    );
};

export default FlightItem;
