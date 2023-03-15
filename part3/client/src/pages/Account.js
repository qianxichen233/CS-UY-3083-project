import Header from "../components/Header";
import Footer from "../components/Footer";
import AccountPanelCustomer from "../components/account/AccountPanel";
import AccountPanelStaff from "../components/staff/Account/AccountPanel";
import useUser from "../hooks/useUser";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Account = () => {
    const { user } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) navigate("/");
    }, [user]);

    const renderPanel = (type) => {
        if (type === "customer") return <AccountPanelCustomer />;
        else if (type === "staff") return <AccountPanelStaff />;
    };

    return (
        <div>
            <Header page="account" />
            {renderPanel(user?.type)}
            <Footer />
        </div>
    );
};

export default Account;
