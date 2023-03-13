import { useState } from "react";
import useUser from "../../hooks/useUser";
import FlightSearch from "./FlightSearch";
import MyFlight from "./MyFlight";
import styles from "./Search.module.scss";
import SearchHeader from "./SearchHeader";
import StatusSearch from "./StatusSearch";

const Search = (props) => {
    const { user } = useUser();
    const [type, setType] = useState("flight");

    const types = [
        {
            id: "flight",
            text: "Search Flights",
        },
        {
            id: "status",
            text: "Check Flight Status",
        },
    ];

    if (user) {
        types.push({
            id: "myflight",
            text: "My Flights",
        });
    }

    const onSearchHandler = (search_body) => {
        props.onSearch(search_body);
    };

    const renderMainFilter = (type) => {
        if (type === "flight") {
            return <FlightSearch onSearch={onSearchHandler} />;
        } else if (type === "status") {
            return <StatusSearch onSearch={onSearchHandler} />;
        } else if (type === "myflight") {
            return <MyFlight onSearch={onSearchHandler} />;
        }
    };

    return (
        <div className={styles.container}>
            <SearchHeader types={types} current={type} onChange={setType} />
            {renderMainFilter(type)}
        </div>
    );
};

export default Search;
