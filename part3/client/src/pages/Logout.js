import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUser from "../hooks/useUser";
import axios from "axios";

const Logout = () => {
    const { user, removeUser } = useUser();
    const navigate = useNavigate();

    const logout = async () => {
        let result;
        try {
            result = await axios.post(
                `http://${process.env.REACT_APP_backend_baseurl}/api/logout`,
                {},
                {
                    withCredentials: true,
                }
            );
        } catch (e) {
            console.log(e.data.msg);
        } finally {
            removeUser();
        }
    };

    useEffect(() => {
        if (!user) navigate("/");
        logout();
    }, [user]);

    return <p>Logging out...</p>;
};

export default Logout;
