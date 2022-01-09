import { useContext, useState,  } from "react"
import { Link } from "@mui/material";
import AuthContext from "../context/authContext"
import useAxios from "../utils/axiosClient"

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment } from "@mui/material";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Navbar = ()=>{
    const {user} = useContext(AuthContext)
    const [search,setSearch]  =useState("")
    const axiosClient = useAxios()
    const navigate = useNavigate()
    return (
    <Box sx={{flexGrow:1}} marginBottom="5">
        <AppBar position="static">
            <Toolbar>
                <Link href="/#" color="inherit"><IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}><HomeIcon/></IconButton></Link>
                {user?<Link href="#/user" color="inherit" underline="none"><Button color="inherit">{user.username}</Button></Link>:<Link href="#/login" underline="none" color="inherit"><Button color="inherit" >Login</Button></Link>}
                {!user&&<Link href="#/signup" underline="none" color="inherit"><Button color="inherit" >Register</Button></Link>}
                {user&&<Button  color="inherit" onClick={()=>{axiosClient.logoutUser();navigate("login") }}>Logout</Button>}
                <div style={{ marginLeft: "auto" }}>
                    <TextField
                    label="Search"
                    variant="standard"
                    InputProps={{
                        onChange: (e)=>(setSearch(e.target.value)),
                        value: search,
                        endAdornment: (
                        <InputAdornment>
                            <IconButton>
                                <Link href={`#/cats/${search}`}  color="inherit">
                                    <SearchIcon/>
                                </Link>
                            </IconButton>
                        </InputAdornment>
                    )}}/>
                </div>
            </Toolbar>
        </AppBar>
    </Box>)
}

export default Navbar
