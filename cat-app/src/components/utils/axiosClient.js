import axios from 'axios'
import { useContext, useEffect } from 'react'
import AuthContext from '../context/authContext'

//axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
//axios.defaults.xsrfCookieName = "csrftoken";

const baseConfig = {
    baseURL: '/api',
    timeout: 10000,
    xsrfHeaderName: 'X-CSRFToken',
    xsrfCookieName: 'csrftoken',
    headers: {
        //'Content-Type': 'application/json',
        'Accept': 'application/json',
        'responseType': "application/json"
    }
}
const useAxios = () => {
    /* This hook provides functions for users and cats api*/ 
    const {authTokens, setAuthTokens, setLoading} = useContext(AuthContext)

    const axiosInstance = axios.create(baseConfig);
    const refreshTokens = async()=>{
        if (authTokens){
            const resp = await axios.post('auth/refresh/',{refresh:authTokens.refresh},baseConfig)
            if(resp.status===200){
                setAuthTokens(resp.data)
            }else{
                // if tokens can't be refreshed, a login is required
                logoutUser()
            }
            return resp
        }
    }
    axiosInstance.interceptors.request.use(async req => {
        // what to do before sending requests
        setLoading(true)
        if (authTokens){
            req.headers.Authorization = `JWT ${authTokens.access}`
        }
        return req
    })
    axiosInstance.interceptors.response.use( res => {
        // what to do after getting a response 
        setLoading(false)// make sure to set this off on 200 + too
        return res
    }, async (error) => {
        let resp = error
        // on a fail try to refresh the token
        // if there are auth tokens, and response is unauthorized still, try to refresh, else log out
        if (error.response && error.response.status===401){
            const refresh_response = await refreshTokens()
            if(refresh_response && refresh_response.status === 200){
                let original_request = error.config
                original_request.headers.Authorization = `JWT ${refresh_response.data.access}` // with the new token
                //setLoading(false)// make sure to set this off
                resp = await  axios.request(original_request);
            }
        }
        setLoading(false)// make sure to set this off
        return resp   // might aswell treat it like a response
    })
    
    const loginUser = async (credentials)=>{
        // attempt to login a user, returns status.
        const resp = await axiosInstance.post('auth/obtain/',credentials)
        if (resp.status === 200){
            setAuthTokens(resp.data)
        }    
        return resp 
    }
    const register = async (data)=>{
        const resp = await axiosInstance.post('users/',data)
        if (resp.status === 201){
            // after a sucssesful signup I want to login the user.
            loginUser({username:data.get("username"), password:data.get("password")})
        }    
        return resp
    }
    const logoutUser = () =>{
        // for ease of acsses
        setAuthTokens(null)
    }
    const clientActions = {
        loginUser:loginUser,
        logoutUser:logoutUser,
        register:register,
        getUserProfile:(username)=>{return axiosInstance.get(`users/${username}/`)},
        updatUserProfile:(username, data)=>{return axiosInstance.put(`users/${username}/`,data)},
        addCat:(data)=>{return axiosInstance.post(`cats/`,data)},
        logCat:(id, data, passkey="")=>{return axiosInstance.post(`cats/${id}/log/`,data,{headers:{"cat-passkey":passkey}})},
        getCat:(id, passkey="")=>{return axiosInstance.get(`cats/${id}/`,(passkey&&{headers:{"cat-passkey":passkey}}))},
        updateCat:(id, data)=>{return axiosInstance.put(`cats/${id}/`,data )},
        deleteCat:(id)=>{return axiosInstance.delete(`cats/${id}/`)},
        getPasskey:(id)=>{return axiosInstance.get(`cats/${id}/passkey/`)},
    }
    return clientActions
}

export default useAxios;

