import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const url = import.meta.env.VITE_API_URL || "http://localhost:4000";
    const [token, setToken] = useState("");

    useEffect(() => {
        async function loadData() {
            sessionStorage.removeItem("delivery_token");
            localStorage.removeItem("delivery_token");

            try {
                const response = await axios.post(url + "/api/user/getuser", {});
                if (response.data.success && response.data.data?.role === "delivery") {
                    setToken("authenticated");
                }
            } catch (error) {
                console.log("No active delivery session");
            }
        }
        loadData();
    }, []);

    const contextValue = {
        url,
        token,
        setToken,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
