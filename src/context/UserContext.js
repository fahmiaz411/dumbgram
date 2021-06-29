import { createContext, useReducer } from "react";
import { useHistory } from "react-router-dom";
import { setAuthToken } from '../config/Api'

export const UserContext = createContext()

const initialState = {
    isLogin: false,
    user: {}
}

const reducer = (state, action) => {
    const { type, payload } = action

    switch(type){
        case "LOGIN_SUCCESS":
            localStorage.setItem('token', payload.token)
            setAuthToken(localStorage.token)
            return {
                ...state,
                isLogin: true,
                user: payload
            }
        case "LOGOUT":
            localStorage.removeItem('token')
            return {
                ...state,
                isLogin: false,
                user: {}
            }
        default:
            throw new Error()
    }
}

export const UserContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    return (
        <UserContext.Provider value={[state, dispatch]}>
            {children}
        </UserContext.Provider>
    )
}