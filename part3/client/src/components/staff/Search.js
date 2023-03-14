import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useUser from "../../hooks/useUser";
import FlightSearch from "./FlightSearch";
import styles from "./Search.module.scss";
import SearchHeader from "../flights/SearchHeader";
import FlightCustomerSearch from "./FlightCustomerSearch";
import AddFlight from "./AddFlight";
import AddPort from "./AddPort";
import AddPlane from "./AddPlane";

const Search = (props) => {
    const { user } = useUser();
    const [type, setType] = useState("flight");

    let [searchParams, _] = useSearchParams();

    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab === "flight") setType("flight");
        else if (tab === "customer") setType("customer");
        else if (tab === "addflight") setType("addflight");
        else if (tab === "addport") setType("addport");
        else if (tab === "addplane") setType("addplane");
    }, [searchParams]);

    const types = [
        {
            id: "flight",
            text: "Search Flights",
        },
        {
            id: "customer",
            text: "Show Flight Customer",
        },
        {
            id: "addflight",
            text: "Add Flight",
        },
        {
            id: "addport",
            text: "Add Airport",
        },
        {
            id: "addplane",
            text: "Add Airplane",
        },
    ];

    const onSearchHandler = (search_body) => {
        props.onSearch(search_body);
    };

    const renderMainFilter = (type) => {
        if (type === "flight") {
            return <FlightSearch onSearch={onSearchHandler} />;
        } else if (type === "customer") {
            return <FlightCustomerSearch onSearch={onSearchHandler} />;
        } else if (type === "addflight") {
            return <AddFlight />;
        } else if (type === "addport") {
            return <AddPort />;
        } else if (type === "addplane") {
            return <AddPlane />;
        }
    };

    return (
        <div className={styles.container}>
            <SearchHeader
                types={types}
                current={type}
                onChange={setType}
                size="14pt"
                gap="70px"
            />
            {renderMainFilter(type)}
        </div>
    );
};

export default Search;
