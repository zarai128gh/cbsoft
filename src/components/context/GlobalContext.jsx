import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const initialState = {
    products: [],
    cart: [],
    categories: [],
    loading: true
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'GET_PRODUCTS':
            return { 
                ...state, 
                products: action.payload.products, 
                categories: action.payload.categories, 
                loading: false 
            };
        case 'ADD_TO_CART':
            const exists = state.cart.find(item => item._id === action.payload._id);
            if (exists) {
                return {
                    ...state,
                    cart: state.cart.map(item => 
                        item._id === action.payload._id 
                        ? { ...item, quantity: item.quantity + 1 } 
                        : item
                    )
                };
            }
            return { ...state, cart: [...state.cart, { ...action.payload, quantity: 1 }] };
        case 'REMOVE_FROM_CART':
            return { ...state, cart: state.cart.filter(item => item._id !== action.payload) };
        case 'SET_CART':
            return { ...state, cart: action.payload };
        case 'CLEAR_CART':
            return { ...state, cart: [] };
        default:
            return state;
    }
};

export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const getProducts = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/products');
                dispatch({ type: 'GET_PRODUCTS', payload: res.data });
            } catch (err) {
                console.log("Backend not running or error fetching products");
                dispatch({ type: 'GET_PRODUCTS', payload: { products: [], categories: [] } }); // Fallback
            }
        };
        getProducts();
    }, []);

    const addToCart = (product) => dispatch({ type: 'ADD_TO_CART', payload: product });
    const removeFromCart = (id) => dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    const setCart = (cart) => dispatch({ type: 'SET_CART', payload: cart });
    const clearCart = () => dispatch({ type: 'CLEAR_CART' });

    return (
        <GlobalContext.Provider value={{ 
            products: state.products, 
            categories: state.categories, 
            cart: state.cart, 
            addToCart, 
            removeFromCart, 
            setCart,
            clearCart,
            loading: state.loading 
        }}>
            {children}
        </GlobalContext.Provider>
    );
};