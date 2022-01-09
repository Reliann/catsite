import { Button, Fade, FormHelperText, Grid, Slide, TextField, Typography, Zoom } from "@mui/material"
import { Box } from "@mui/system"
import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import AuthContext from "../context/authContext"
import useAxios from "../utils/axiosClient"
import CatFeed from "./catFeed"
import CatLogs from "./catlogs"
import CatProfile from "./catProfile"

const sortByDate = (a, b) =>{
    return new Date(a.feed_time).getTime() - new Date(b.feed_time).getTime();
}
const CatPage = ()=>{
    const {id} = useParams()
    const [cat, setCat] = useState(null)
    const {getCat} = useAxios()
    const {passkeys, setPasskeys} = useContext(AuthContext)
    const [message, setMessage] = useState({
        "passkey":"",
        'detail':""
    })
    const navigate = useNavigate()

    const requestCat = async(passkey="")=>{
        const resp = await getCat(id, passkey)
        if (resp.status ===200){
            if (resp.data.logs){
                resp.data.logs.sort(sortByDate).reverse()
            }
            
            setCat(resp.data)
        }else if(resp.response && resp.response.status === 404){
            // if there is no such cat its 404 
            navigate('../../404')
        }
        return resp
    }
    const pre_fetch = async()=>{
        // this is done when the cat needs to be re-requested or first requested
        const resp = await passkeys[id]? requestCat(passkeys[id]) :requestCat()
        if (resp.status===401 && passkeys[id]){
            // the pass wasnt good remove it
            setPasskeys({...passkeys,[id]:undefined})
        }
    }
    useEffect(()=>{ 
    // try to get acsses as the logged user, with a passkey or owner
    // and...do this every time the id change (the url param)
        pre_fetch()
    },[id])
    const resetMessage = ()=>{
        setMessage({passkey:"", detail:""})
    }
    const customSubmit =async (e)=>{
        e.preventDefault()
        const data = new FormData(e.target)
        const passkey = data.get("passkey")
        const resp = await requestCat(passkey)
        if (resp.status === 200){
            setPasskeys({...passkeys, [id]:passkey })
            // if the request sucseeded via form i wanna keep the passkey
        }else if(resp.response && (resp.response.status === 400 || resp.response.status === 403 )){
            setMessage({...message, passkey:"wrong passkey"})
        }else{
            setMessage({...message, detail:resp.message})
        }
    }
    if (cat){
        if (!('logs' in cat)){
        return <Slide timeout={1000} direction="up" in={true} mountOnEnter unmountOnExit><Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
            <CatProfile cat ={cat}/>
            <Typography component="h1" variant="h5">
                Please enter passkey to continue
            </Typography>
            <Box component="form" onSubmit={customSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                    required
                    margin="normal"
                    fullWidth
                    id="passkey"
                    label="Passkey"
                    name="passkey"
                    autoFocus
                    error={message.passkey}
                    helperText={message.passkey}
                    onChange={resetMessage}
                />
                <FormHelperText>{message.detail}</FormHelperText>
                    <Button
                    type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Continue</Button>
            </Box>
            </Box></Slide>
        }else{
            return <Grid container justifyContent="center" alignItems="center" >
            <Grid item xs={6}>
                <Zoom in={true}><Box><CatProfile cat ={cat}/></Box></Zoom>
            </Grid>
            <Grid item xs={6}>
                <Fade in = {true}>
                    <Box><CatFeed cat_id = {cat.id} addLog={pre_fetch}/></Box>
                </Fade>
            </Grid>
            <Grid item xs={8}>
                <Fade in = {true}>
                    <Box>
                        <CatLogs cat = {cat}/>
                    </Box>
                </Fade>
                
            </Grid>
        </Grid>
        }
    }else{
        return <div></div>
    }
    
}

export default CatPage