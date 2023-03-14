import Header from "../components/Header";
import Footer from "../components/Footer";
import AccountPanel from "../components/account/AccountPanel";

const Account = () => {
    return (
        <div>
            <Header page="account" />
            <AccountPanel />
            <Footer />
        </div>
    );
};

export default Account;
