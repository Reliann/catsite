import { useContext, useEffect, useState } from "react"
import { Button, Grow, IconButton, Link, Typography } from "@mui/material"
import AuthContext from "../context/authContext"
import AddCircleIcon from '@mui/icons-material/AddCircle';
import useAxios from "../utils/axiosClient"
import CatCard from "./catCard"
import { Grid } from "@mui/material"
import SettingsIcon from '@mui/icons-material/Settings';
import { Box } from "@mui/system";
import Loading from "../generic/loading";

const AuthUserProfile = ()=>{
    const {user,loading} = useContext(AuthContext)// this is private route so user must be set
    const {getUserProfile} = useAxios()
    const [profile,setUserProfile] = useState({
        username:"",
        cats:[]
    })

    useEffect(()=>{   // fetch data accourding to user
        const getProfile=async ()=>{
            const resp = await getUserProfile(user.username)
            if (resp.status === 200 ){
                setUserProfile(resp.data)
            }
        }
        getProfile()
    },[])
    return <Box>
        <Link href="#/user/edit" color="inherit" display="block" textAlign="right" underline="none">
            <Button variant="outlined" startIcon={<SettingsIcon/>}>Edit Your Info</Button>
        </Link>
        <Typography variant="h2" >Hey, {user &&( user.first_name || user.username)}</Typography>
        
        {profile.cats.length ? 
        <Typography marginLeft={10} align="left" variant="h3" display="block">Your Cats <Link href="#/user/addcat" color="inherit" underline="none"><Button variant="contained" startIcon={<AddCircleIcon/>}>Add Cat</Button></Link></Typography>
        :!loading&&<h3>You dont have any cats yet... but you can <Link href="#/user/addcat" color="secondary" >add</Link> one now!</h3>}
        
        <Grid container spacing={2} justifyContent="center">
            {profile.cats.map((cat, index)=>(
            <Grow in={true} timeout={500*(index+1)} key={cat.id}>
                <Grid item padding="2">
                    <CatCard  cat={cat} deleteMe={()=>{
                        const cats = profile.cats.filter(c => cat.id!== c.id)
                        setUserProfile({...profile, cats:[...cats]})
                    }}/>
                </Grid>
            </Grow>))}
        </Grid>
    </Box>
}

export {AuthUserProfile,}