import { useState } from "react";
import "./App.css";
import ShowFlights from "./components/flights/ShowFlights";
import ShowFlightStatus from "./components/flights/ShowFlightStatus";
import Header from "./components/Header";

function App() {
    const [login, setLogin] = useState(false);

    return (
        <div className="App">
            <Header />
            <ShowFlights />
            <ShowFlightStatus />
        </div>
    );
}

export default App;
