import { Grid, Grow, Typography } from "@mui/material"
import { Box, } from "@mui/system"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import useAxios from "../utils/axiosClient"
import PublicCatProfile from "./publicCatProfile.js"

const UserProfile = ()=>{
    const {username} = useParams()
    const [profile, setProfile] = useState({
        "username":"",
        cats:[]
    })
    const {getUserProfile} = useAxios()
    const navigate = useNavigate()
    useEffect(()=>{
        const fetchData = async()=>{
            const resp = await getUserProfile(username)
            if (resp.status === 200){
                setProfile(resp.data)
            }else if (resp.response && resp.response.status ===404){
                navigate("../../404")
            }
        }
        fetchData()
    },[])

    return <Box>
        <Typography variant="h2">
            <b>{profile.username}</b>
        </Typography>
        <Typography variant="h3">
            Owned Cats
        </Typography>
        <Grid container spacing={5} justifyContent="center">
            {profile.cats.map((cat, index)=>(
                <Grow in={true} timeout={500*(index+1)} key={cat.id}><Grid item><PublicCatProfile cat = {cat} /></Grid></Grow>
            ))}
        </Grid>
    </Box>
}

export default UserProfile