import "./App.css";

import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Context } from "./context/context";

import Main from "./pages/Main";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Logout from "./pages/Logout";
import Account from "./pages/Account";
import Comment from "./pages/Comment";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Main />,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/register",
        element: <RegisterPage />,
    },
    {
        path: "/logout",
        element: <Logout />,
    },
    {
        path: "/account",
        element: <Account />,
    },
    {
        path: "/comment",
        element: <Comment />,
    },
]);

const getUser = () => {
    const user = {
        type: localStorage.getItem("type"),
        username: localStorage.getItem("username"),
        first_name: localStorage.getItem("first_name"),
        last_name: localStorage.getItem("last_name"),
        airline: localStorage.getItem("airline"),
    };
    if (!user.username) return null;
    return user;
};

function App() {
    const [user, setUser] = useState(getUser());

    return (
        <Context.Provider value={{ user: user, setUser: setUser }}>
            <RouterProvider router={router} />
        </Context.Provider>
    );
}

export default App;
