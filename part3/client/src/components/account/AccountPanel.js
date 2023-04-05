import axios from "axios";
import { useEffect, useState } from "react";
import useUser from "../../hooks/useUser";

import styles from "./AccountPanel.module.scss";
import DateSearch from "./DateSearch";
import InfoBox from "./InfoBox";
import SpendingChart from "./SpendingChart";

const dummy = {
    address: {
        apartment_number: "1",
        building_number: 1,
        city: "New York",
        state: "New York",
        street_name: "Jay St.",
        zip_code: "11201",
    },
    date_of_birth: "Sat, 01 Jan 2000 00:00:00 GMT",
    email: "qc815@nyu.edu",
    first_name: "Qianxi",
    last_name: "Chen",
    phone_numbers: ["123-456-789"],
    passport: {
        country: "China",
        expiration: "Wed, 31 Dec 2025 00:00:00 GMT",
        number: "12345",
    },
};

const dummy_spending = [
    {
        month: "2023-03",
        cost: 109.9,
    },
    {
        month: "2023-02",
        cost: 306.5,
    },
    {
        month: "2023-01",
        cost: 0,
    },
    {
        month: "2022-12",
        cost: 123.4,
    },
    {
        month: "2022-11",
        cost: 634.2,
    },
    {
        month: "2022-10",
        cost: 123.5,
    },
    {
        month: "2022-09",
        cost: 233.3,
    },
    {
        month: "2022-08",
        cost: 0,
    },
    {
        month: "2022-07",
        cost: 0,
    },
    {
        month: "2022-06",
        cost: 123.4,
    },
    {
        month: "2022-05",
        cost: 455.6,
    },
    {
        month: "2022-04",
        cost: 432.1,
    },
];

const convertSpending = (spending) => {
    const result = {};
    for (const item of spending) result[item.month] = item.cost;
    return result;
};

const convertMonth = (number) => {
    ++number;
    if (number <= 9) return "0" + number.toString();
    return number.toString();
};

const getYearMonth = (date) => {
    return date.getFullYear().toString() + "-" + convertMonth(date.getMonth());
};

const AccountPanel = (props) => {
    const { user } = useUser();

    const [data, setData] = useState();

    const [spendingRange, setSpendingRange] = useState({
        from: getYearMonth(
            new Date(new Date().setFullYear(new Date().getFullYear() - 1))
        ),
        to: getYearMonth(new Date()),
    });

    const halfYearAgo = new Date().setDate(new Date().getDate() - 183);

    const [chartRange, setChartRange] = useState({
        from: getYearMonth(new Date(halfYearAgo)),
        to: getYearMonth(new Date()),
    });

    const [spending, setSpending] = useState();

    const fetchUserData = async () => {
        return setData(dummy);
        let result;
        try {
            result = await axios.get(
                `http://${process.env.REACT_APP_backend_baseurl}/api/customer`,
                {
                    params: {
                        type: "customer",
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

    const fetchSpendingData = async (range) => {
        try {
            const result = axios.get(
                `http://${process.env.REACT_APP_backend_baseurl}/api/spending`,
                {
                    params: {
                        from: range.from,
                        to: range.to,
                    },
                    withCredentials: true,
                }
            );

            setSpending(result.data.flights);
        } catch (e) {
            console.error(e.response?.data.msg);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        //fetchSpendingData(spendingRange);
        setSpending(dummy_spending);
    }, [spendingRange]);

    const onSpendingDateChangeHandler = ({ from, to }) => {
        setSpendingRange({
            from: from,
            to: to,
        });

        setChartRange({
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
                        name: "Email",
                        value: data.email,
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
                        name: "Phone Numbers",
                        value: data.phone_numbers[0],
                    },
                ]}
            />
            <InfoBox
                title="Address Details"
                info={[
                    {
                        name: "State",
                        value: data.address.state,
                    },
                    {
                        name: "City",
                        value: data.address.city,
                    },
                    {
                        name: "Street Name",
                        value: data.address.street_name,
                    },
                    {
                        name: "Building Numver",
                        value: data.address.building_number,
                    },
                    {
                        name: "Apartment Number",
                        value: data.address.apartment_number,
                    },
                    {
                        name: "Zip Code",
                        value: data.address.zip_code,
                    },
                ]}
            />
            <InfoBox
                title="Passport Details"
                info={[
                    {
                        name: "Passport Country",
                        value: data.passport.country,
                    },
                    {
                        name: "Passport Number",
                        value: data.passport.number,
                    },
                    {
                        name: "Passport Expiration",
                        value: new Date(data.passport.expiration)
                            .toDateString()
                            .split(" ")
                            .slice(1)
                            .join(" "),
                    },
                ]}
            />
            <DateSearch
                from={spendingRange.from}
                to={spendingRange.to}
                onChange={onSpendingDateChangeHandler}
                text="Track Your Spending"
            />
            {!!spending && (
                <SpendingChart
                    spending={convertSpending(spending)}
                    range={chartRange}
                    spendingRange={spendingRange}
                />
            )}
        </div>
    );
};

export default AccountPanel;
