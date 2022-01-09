import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import useAxios from "../utils/axiosClient"


import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
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


const Signup = ()=>{
    const [message, setMessage] = useState({
        "first_name": [],
        "last_name":[],
        "email": [],
        "username": [],
        "password": [],
        "validation": [],
        "detail":[]
    })
    const {logoutUser,register} = useAxios()
    const {setRememberMe} = useContext(AuthContext)
    const navigate = useNavigate()
    useEffect(()=>{
        logoutUser()
    },[])
    const handleInput = (e) =>{
        setMessage({...message,[e.target.name]:[]})
    
    }

    const customSubmit = async (e)=>{
        e.preventDefault()
        
        let registration_data = new FormData(e.currentTarget)
        if (registration_data.get("validation")!==registration_data.get("password")){
            setMessage({...message,validation:["Passwords do not match",]})
            return
        }
        setRememberMe(registration_data.get("rememberMe")?true:false)
        registration_data.delete("validation")
        registration_data.delete("rememberMe")
        const resp =await register(registration_data)
        //const resp = await register(credentials)
        if (resp.status === 201){
            navigate('../')
        }
        else if (resp.response && (resp.response.status ===400 || resp.response.status ===409)){// bad request
            setMessage({...message,...resp.response.data})
        }
        else{// probably some error
            setMessage({...message,detail:resp.message})
        }
    }
    return <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8, 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={customSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoFocus
                  autoComplete = "name"
                  autoComplete="given-name"
                  name="first_name"
                  fullWidth
                  id="firstName"
                  label="First Name"
                  error={message.first_name.length !== 0}
                  helperText={message.first_name[0]}
                  onChange={handleInput}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="last_name"
                  error={message.last_name.length !== 0}
                  helperText={message.last_name[0]}
                  onChange={handleInput}
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  error={message.email.length !== 0}
                  helperText={message.email[0]}
                  onChange={handleInput}
                  autoComplete="email"
                />
              </Grid><Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  error={message.username.length !== 0}
                  helperText={message.username[0]}
                  onChange={handleInput}
                  autoComplete="username"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  error={message.password.length !== 0}
                  helperText={message.password[0]}
                  onChange={handleInput}
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="validation"
                  label="Validate Password"
                  type="password"
                  id="validation"
                  error={message.validation.length !== 0}
                  helperText={message.validation[0]}
                  onChange={handleInput}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox checked value="rememberMe" name="rememberMe" color="primary" />}
                  label="Remember Me"
                />
              </Grid>
            </Grid>
            <Typography>{message.detail}</Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="../#/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        </Container>
}

export default Signup