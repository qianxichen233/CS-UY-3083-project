import { createContext } from "react";
export const Context = createContext({
    user: {
        username: "",
        first_name: "",
        last_name: "",
    },
    setUser: () => {},
});
