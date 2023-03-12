import useUser from "../../hooks/useUser";
import axios from "axios";

const Account = (props) => {
    const { user, removeUser } = useUser();

    if (!user) return null;

    const logoutHandler = async () => {
        let result;
        try {
            result = await axios.post(
                `http://${process.env.REACT_APP_backend_baseurl}/api/logout`,
                {},
                {
                    withCredentials: true,
                }
            );
            console.log(result);
            removeUser();
        } catch (e) {
            console.log(e.data.msg);
        }
    };

    return (
        <div>
            <section>
                <span>{user.username}</span>
                <span>{user.first_name}</span>
                <span>{user.last_name}</span>
            </section>
            <button onClick={logoutHandler}>Logout</button>
        </div>
    );
};

export default Account;
