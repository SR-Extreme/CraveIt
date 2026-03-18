import axios from "axios";
import { createContext, useEffect } from "react"
import { useState } from "react"

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const url = "http://localhost:4000";
    const [token, setToken] = useState("");
    const [food_list, setFoodList] = useState([]);
    const [promocode, setPromocode] = useState("");
    const [isCorrectPromo, setIsCorrectPromo] = useState(false);

    const [defaultIndex, setDefaultIndex] = useState(() => {
        return localStorage.getItem("defaultIndex") !== null
            ? Number(localStorage.getItem("defaultIndex"))
            : null;
    });

    const [DefaultData, setDefaultData] = useState(() => {
        const savedData = localStorage.getItem("defaultAddress");
        return savedData
            ? JSON.parse(savedData)
            : {
                firstName: "",
                lastName: "",
                email: "",
                street: "",
                city: "",
                state: "",
                zipcode: "",
                country: "",
                phone: ""
            };
    });

    const targetPromocode = "SAURAV10";

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));

        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
        }
    }

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }

        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                totalAmount += itemInfo.price * cartItems[item];
            }
        }
        return totalAmount;
    }

    const fetchFoodList = async () => {
        const response = await axios.get(url + "/api/food/list");
        setFoodList(response.data.data);
    }

    //to keep the existing cart data and value typed 1,2,3... as it  is after refresh;
    const loadCartData = async (token) => {
        const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
        setCartItems(response.data.cartData);
    }

    //useEffects
    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
            }
        }
        loadData();
    }, []);

    useEffect(() => {
        if (defaultIndex !== null) {
            localStorage.setItem("defaultIndex", defaultIndex);
        }
    }, [defaultIndex]);

    useEffect(() => {
        localStorage.setItem("defaultAddress", JSON.stringify(DefaultData));
    }, [DefaultData]);

    const contextValue = {
        food_list,
        cartItems,
        addToCart,
        removeFromCart,
        setCartItems,
        getTotalCartAmount,
        url,
        token,
        setToken,
        promocode,
        setPromocode,
        targetPromocode,
        isCorrectPromo,
        setIsCorrectPromo,
        DefaultData,
        setDefaultData,
        defaultIndex,
        setDefaultIndex
    }
    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;