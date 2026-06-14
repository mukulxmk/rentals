import { createContext, useState, useEffect } from "react";
import API from "../api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currUser, setCurrUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [loading, setLoading] = useState(!currUser);

const checkLoggedIn = async () => {
    try {
       
        const res = await API.get("/auth/current_user", { withCredentials: true });
        setCurrUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
        setCurrUser(null);
        localStorage.removeItem("user");
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {
        checkLoggedIn();
    }, []);

    const updateUser = (user) => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
            setCurrUser(user);
        } else {
            localStorage.removeItem("user");
            setCurrUser(null);
        }
    };


    return (
        <AuthContext.Provider value={{ currUser, setCurrUser: updateUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};