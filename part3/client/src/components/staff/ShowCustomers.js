import FlightItem from "../flights/FlightItem";
import CustomerItem from "./CustomerItem";
import styles from "./ShowCustomers.module.scss";

const ShowCustomers = ({ info: { customers, flight } }) => {
    return (
        <div className={styles.container}>
            <div className={styles.division}>
                <span>Selected Flight</span>
            </div>
            <FlightItem flight={flight} selected />
            <div className={styles.division}>
                <span>Customers</span>
            </div>
            {customers.map((customer) => {
                return (
                    <CustomerItem
                        key={customer.email + customer.purchased_date}
                        customer={customer}
                        ticket={true}
                    />
                );
            })}
        </div>
    );
};

export default ShowCustomers;
