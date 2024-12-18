import { createContext, useEffect, useState } from "react"
import Loading from '../generic/loading'
import jwt_decode from "jwt-decode";

const AuthContext = createContext()

export default AuthContext

export const AuthProvider = ({children})=>{
    let [authTokens, setAuthTokens] = useState(JSON.parse(localStorage.getItem('authTokens')))
    let [user, setUser] = useState(authTokens?jwt_decode(authTokens.access):null)
    let [loading, setLoading] = useState(false)
    const [rememberMe, setRememberMe] = useState(authTokens?true:false)
    const [passkeys,setPasskeys] = useState(JSON.parse(localStorage.getItem('passkeys')) || {})
    useEffect(()=>{
        // those are not user dependent!
        localStorage.setItem('passkeys', JSON.stringify(passkeys))

    },[passkeys])
    useEffect(()=>{
        // user and storage change when tokens change
        if(authTokens){
            if(rememberMe){
                localStorage.setItem('authTokens', JSON.stringify(authTokens))
            }
            else{
                sessionStorage.setItem('authTokens', JSON.stringify(authTokens))
            }
        }else{
            if (user){ // it's a logout...
                localStorage.removeItem('authTokens')
                localStorage.removeItem('passkeys')
                sessionStorage.removeItem('authTokens')
                setRememberMe(false)
            }
        }
        setUser(authTokens?jwt_decode(authTokens.access):null)
    },[authTokens])

    let context_data = {
        user:user,
        setUser:setUser,
        authTokens:authTokens,
        setAuthTokens:setAuthTokens,
        loading:loading,
        setLoading:setLoading,
        passkeys:passkeys,
        setPasskeys:setPasskeys,
        setRememberMe:setRememberMe,
    }
    return <AuthContext.Provider value = {context_data}>
        {loading&& <Loading/>}
        {children}
    </AuthContext.Provider>
}