import { useState } from "react";
import useUser from "../../hooks/useUser";
import Account from "./Account";
import Login from "./Login";
import Register from "./RegisterCustomer";

import { useContext } from "react";
import { Context } from "../../context/context";

const AccountPanel = (props) => {
    const { user } = useUser();
    console.log("account panel", user);

    return (
        <div>
            <Register />
            {!user && <Login type="customer" />}
            {!!user && <Account />}
        </div>
    );
};

export default AccountPanel;
