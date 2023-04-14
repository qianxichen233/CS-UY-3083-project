import axios from "axios";
import { useEffect, useState } from "react";

import styles from "./AccountPanel.module.scss";
import DateSearch from "../../account/DateSearch";
import InfoBox from "../../account/InfoBox";
import useUser from "../../../hooks/useUser";
import TicketChart from "./TicketChart";
import Cart from "../../UI/Cart";
import CustomerItem from "../CustomerItem";
import { getCookie } from "../../../utility";

const convertMonth = (number) => {
    ++number;
    if (number <= 9) return "0" + number.toString();
    return number.toString();
};

const fetchRevenueRange = async ({ from, to, airline }) => {
    try {
        const result = await axios.get(
            `http://${process.env.REACT_APP_backend_baseurl}/api/revenue`,
            {
                params: {
                    start_date: from,
                    end_date: to,
                    airline: airline,
                },
                withCredentials: true,
            }
        );

        return result.data.revenue;
    } catch (e) {
        console.error(e.response?.data.msg);
    }
};

const getYearMonth = (date) => {
    return date.getFullYear().toString() + "-" + convertMonth(date.getMonth());
};

const AccountPanel = (props) => {
    const { user } = useUser();

    const [data, setData] = useState();

    const [ticketRange, setTicketRange] = useState({
        from: "",
        to: "",
    });

    const [revenue, setRevenue] = useState();
    const [frequentCustomer, setFrequentCustomer] = useState();

    const [tickets, setTickets] = useState();

    const fetchRevenue = async () => {
        const oneMonthAgo = new Date(
            new Date().setMonth(new Date().getMonth() - 1)
        );
        const oneYearAgo = new Date(
            new Date().setFullYear(new Date().getFullYear() - 1)
        );

        const month = await fetchRevenueRange({
            airline: user.airline,
            from: getYearMonth(oneMonthAgo),
            to: getYearMonth(new Date()),
        });

        const year = await fetchRevenueRange({
            airline: user.airline,
            from: getYearMonth(oneYearAgo),
            to: getYearMonth(new Date()),
        });

        setRevenue({
            month,
            year,
        });
    };

    const fetchFrequentCustomer = async () => {
        const oneYearAgo = new Date(
            new Date().setFullYear(new Date().getFullYear() - 1)
        );

        try {
            const result = await axios.get(
                `http://${process.env.REACT_APP_backend_baseurl}/api/customer/frequent`,
                {
                    params: {
                        start_date: getYearMonth(oneYearAgo),
                        end_date: getYearMonth(new Date()),
                        airline: user.airline,
                    },
                    withCredentials: true,
                }
            );

            setFrequentCustomer(result.data.customer);
        } catch (e) {
            console.error(e.response?.data.msg);
        }
    };

    const fetchUserData = async () => {
        try {
            const result = await axios.get(
                `http://${process.env.REACT_APP_backend_baseurl}/api/customer`,
                {
                    params: {
                        type: "staff",
                        username: user.username,
                    },
                    withCredentials: true,
                }
            );

            setData(result.data);
        } catch (e) {
            console.error(e.response?.data.msg);
        }
    };

    const fetchTicketsData = async (range) => {
        try {
            const result = await axios.get(
                `http://${process.env.REACT_APP_backend_baseurl}/api/tickets`,
                {
                    params: {
                        airline: user.airline,
                        start_date: range.from,
                        end_date: range.to,
                    },
                    withCredentials: true,
                }
            );
            setTickets(result.data.tickets);
        } catch (e) {
            console.error(e.response?.data.msg);
        }
    };

    const onAddPhoneNumber = async (phone_number) => {
        try {
            const result = await axios.post(
                `http://${process.env.REACT_APP_backend_baseurl}/api/user/phone_number`,
                {
                    type: "staff",
                    username: user.username,
                    phone_numbers: [phone_number],
                },
                {
                    withCredentials: true,
                    headers: {
                        "X-CSRF-TOKEN": getCookie("csrf_access_token"),
                    },
                }
            );

            fetchUserData();
        } catch (e) {
            console.error(e.response?.data.msg);
        }
    };

    const onAddEmail = async (email) => {
        try {
            const result = await axios.post(
                `http://${process.env.REACT_APP_backend_baseurl}/api/user/email`,
                {
                    username: user.username,
                    emails: [email],
                },
                {
                    withCredentials: true,
                    headers: {
                        "X-CSRF-TOKEN": getCookie("csrf_access_token"),
                    },
                }
            );

            fetchUserData();
        } catch (e) {
            console.error(e.response?.data.msg);
        }
    };

    useEffect(() => {
        fetchUserData();
        fetchRevenue();
        fetchFrequentCustomer();
    }, []);

    useEffect(() => {
        if (!ticketRange.from || !ticketRange.to) return;
        fetchTicketsData(ticketRange);
    }, [ticketRange]);

    const onTicketDateChangeHandler = ({ from, to }) => {
        setTicketRange({
            from: from,
            to: to,
        });
    };

    if (!data) return;

    return (
        <div className={styles.container}>
            <InfoBox
                title="Personal Details"
                info={[
                    {
                        name: "Username",
                        value: data.username,
                    },
                    {
                        name: "Name",
                        value: data.first_name + " " + data.last_name,
                    },
                    {
                        name: "Date of Birth",
                        value: new Date(data.date_of_birth)
                            .toDateString()
                            .split(" ")
                            .slice(1)
                            .join(" "),
                    },
                    {
                        name: "Airline Name",
                        value: data.airline_name,
                    },
                    {
                        name: "Emails",
                        value: data.emails,
                        add: true,
                        onAdd: onAddEmail,
                    },
                    {
                        name: "Phone Numbers",
                        value: data.phone_numbers,
                        add: true,
                        onAdd: onAddPhoneNumber,
                    },
                ]}
            />
            {!!revenue && (
                <Cart title="Revenue">
                    <div className={styles.revenue}>
                        <section>
                            <span>Revenue Earned Last Month</span>
                            <span>{revenue.month}$</span>
                        </section>
                        <section>
                            <span>Revenue Earned Last Year</span>
                            <span>{revenue.year}$</span>
                        </section>
                    </div>
                </Cart>
            )}
            {!!frequentCustomer && (
                <Cart title="Most Frequent Customer">
                    <CustomerItem customer={frequentCustomer} />
                </Cart>
            )}
            <DateSearch
                from={ticketRange.from}
                to={ticketRange.to}
                onChange={onTicketDateChangeHandler}
                text="View Ticket Report"
            />
            {!!tickets && <TicketChart tickets={tickets} range={ticketRange} />}
        </div>
    );
};

export default AccountPanel;
