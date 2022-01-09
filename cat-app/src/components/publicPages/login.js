import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import useAxios from "../utils/axiosClient"


import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import AuthContext from "../context/authContext";


const Login = ()=>{
    //const authContext = useContext(AuthContext)
    const navigate = useNavigate()
    const [message,setMessage] = useState({
        'username':[],
        'password':[],
        'detail':[]
    })
    
    const {logoutUser,loginUser} = useAxios()
    const {setRememberMe} =useContext(AuthContext)
    useEffect(()=>{
        logoutUser()
    },[])
    const handleInput =(e)=>{
        //setInputs({...inputs,[e.target.name]:e.target.value})
        setMessage({...message,[e.target.name]:[]})
    }
    const customSubmit = async (e) =>{
        e.preventDefault()
        // const resp = await loginUser(inputs)
        let registration_data = new FormData(e.currentTarget)
        setRememberMe(registration_data.get("rememberMe")?true:false)
        registration_data.delete("rememberMe")
        
        const resp =await loginUser(registration_data)
        if (resp.status === 200){
            navigate('../')
        }
        else if (resp.response && resp.response.status >=400){// bad request
            setMessage({...message,...resp.response.data})
        }
        else{// probably some error
            setMessage({...message,detail:[resp.message]})
        }
    }
    return <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={customSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Email or username"
              name="username"
              autoComplete="email"
              autoFocus
              error={message.username.length !== 0}
              helperText={message.username[0]}
              onChange={handleInput}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              error={message.password.length !== 0}
              helperText={message.password[0]}
              onChange={handleInput}
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="rememberMe" checked name="rememberMe" color="primary" />}
              label="Remember me"
            />
            <Typography>{message.detail}</Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              {/* <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid> */}
              <Grid item>
                <Link href="../#/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>

}

export default Login