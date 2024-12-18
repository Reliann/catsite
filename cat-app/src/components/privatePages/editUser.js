import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import AuthContext from "../context/authContext"
import useAxios from "../utils/axiosClient"

const UpdateUser = ()=>{
    // ideally this page should only be availabe via email link... 
    // but I don't have much budget :(
    // hopefully in the future
    const [message, setMessage] = useState({
        "first_name": "",
        "last_name": "",
        "email": "",
        "username": "",
        "password": "",
        "validation": "",
    })
    const [inputs, setInputs] = useState({
        "first_name": "",
        "last_name": "",
        "email": "",
        "username": "",
        "password": "",
        "validation": "",
        "valid":false
    })
    const {user} = useContext(AuthContext)
    const {updatUserProfile, loginUser} = useAxios()
    const navigate = useNavigate()
    useEffect(()=>{  
        setInputs({...inputs,...user})
    },[inputs, user])
    const handleInput = (e) =>{
        // to avoid async issues of 2 setStates..
        setMessage({...message,[e.target.name]:[]})
        if(e.target.name === "validation"){
            setInputs({...inputs, [e.target.name]:e.target.value, valid:(inputs.password === e.target.value)})
        }
        else if(e.target.name === "password"){
            setInputs({...inputs, [e.target.name]:e.target.value, valid:(inputs.validation === e.target.value)})
        }
        else{
            setInputs({...inputs,[e.target.name]:e.target.value})
        }
    }

    const customSubmit = async (e)=>{
        e.preventDefault()
        if (!inputs.valid){
            setMessage({...message,validation:"Passwords do not match"})
            return
        }
        // omitting those fields from the request
        const {validation,valid,...updated_data} = inputs
        const resp = await updatUserProfile(user.username,updated_data)
        if (resp.status === 200){
            // log in again with new credentials (for new tokens!)
            loginUser({username:updated_data.username, password:updated_data.password})
            navigate('../../')
        }
        else if (resp.response && resp.response.status >=400){// bad request
            setMessage({...message,...resp.response.data})
        }
        else{// probably some error
            setMessage({...message,detail:resp.message})
        }
    }
    return <div>
        <h3>Edit your profile</h3>
        <form onSubmit={customSubmit}>
            <lable><b>Username </b><input value={inputs.username} onChange={handleInput} name="username" placeholder = "username"/></lable><br/>
            {message.username}<br/>
            <lable><b>Password </b><input value={inputs.password} onChange={handleInput} name="password" type="password" placeholder = "password"/></lable><br/>
            {message.password}<br/>
            <lable><b>Password validation:</b><input value={inputs.validation} onChange={handleInput} name="validation" type="password" placeholder = "enter password again..."/></lable><br/>
            {message.validation}<br/>
            <lable><b>Email </b><input value={inputs.email} onChange={handleInput}  name="email" placeholder = "email"/></lable><br/>
            {message.email}<br/>
            <lable><b>first name </b><input value={inputs.first_name} onChange={handleInput} name="first_name" placeholder = "first name"/></lable><br/>
            {message.first_name}<br/>
            <lable><b>last name </b><input value={inputs.last_name} onChange={handleInput} name="last_name" placeholder = "last name"/></lable><br/>
            {message.last_name}<br/>
            {message.detail}<br/>
            <input  type = "submit" value="Update"></input>
        </form>
    </div>
}

export default UpdateUser