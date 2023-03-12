import { useContext } from "react";
import { Context } from "../context/context";

function useUser() {
    const { user, setUser } = useContext(Context);

    function saveUser(new_user) {
        localStorage.setItem("username", new_user.username);
        localStorage.setItem("first_name", new_user.first_name);
        localStorage.setItem("last_name", new_user.last_name);

        setUser(new_user);
    }

    function removeUser() {
        localStorage.removeItem("username");
        localStorage.removeItem("first_name");
        localStorage.removeItem("last_name");

        setUser(null);
    }

    return {
        saveUser,
        user,
        removeUser,
    };
}

export default useUser;
