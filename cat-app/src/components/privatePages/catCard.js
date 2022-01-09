import { useState } from "react"
import useAxios from "../utils/axiosClient"
import { CardHeader, FormControlLabel, FormGroup, Link, Slide, Snackbar, Switch } from "@mui/material";

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CardActionArea } from "@mui/material";
import { Box, width } from "@mui/system";

const CatCard = (props)=>{
    const [passkey,setPasskey] = useState("")
    const [hidePasskey,setHidePasskey] = useState(true)
    const {getPasskey, deleteCat} = useAxios()
    const [copied,setCopied] = useState(false)

    const fetchPass = async () =>{
        const resp = await getPasskey(props.cat.id)
        if (resp.status === 200){
            setPasskey(resp.data.cat_passkey)
            return resp.data.cat_passkey
        }else{
            return ""
        }
    }
    const removeCat = async()=>{
        const resp = await deleteCat(props.cat.id)
        if ( resp.status === 204){
            props.deleteMe()
        }
    }
    const copyShareText = async ()=>{
        let pass = passkey
        if (!passkey){
            pass = await fetchPass()
        }
        navigator.clipboard.writeText(`Hey! I've registered my cat ${props.cat.cat_name} to catlogs and I would like you 
        to log whenever you feed them! link to my cat's page: ${window.location.hostname}/#/cats/${props.cat.id} 
        and the passkey is ${pass}`)
        setCopied(true)
    }
    return (<Card>

        <Snackbar
            autoHideDuration={2000}
            open={copied}
            ContentProps={{
                'aria-describedby': 'message-id',
                'style':{
                    width:"20px"
                }
            }} 
            action={<Button sx={{color:"secondary.light"}} size="small" onClick={()=>{setCopied(false)}}>
            Dismiss
          </Button>}
            message={<span id="message-id"> Copied! </span>}
            onClose={() => setCopied(false)}
        />

        <div style={{position:"relative",}}>
            <div style={{position:"absolute", right:"0%", zIndex:"+1"}}>
            <Link color="inherit" href={`/#/user/${props.cat.id}/edit`}><IconButton color="inherit" size="large" edge="start"  sx={{ mr: 2 }}
            ><EditIcon/></IconButton></Link>
            <IconButton onClick={removeCat} size="large" edge="start" color="error" sx={{ mr: 2 }}
            ><DeleteIcon/></IconButton>
            </div>
        </div>
            
        
        <Link href={`/#/cats/${props.cat.id}`} color ="inherit" underline="none" component={CardActionArea}>
        <CardMedia
          component="img"
          style={{opacity:"70%"}}
          alt="cat-avatar"
          height="140"
          image={props.cat.image || "https://res.cloudinary.com/catlogs/image/upload/v1641214316/media/images/cat_avatar_placeholder.png"}
        />
        
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {props.cat.cat_name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            { `Passkey: ${(!hidePasskey &&passkey) ? passkey:"******"}`}
          </Typography>

                
        </CardContent>
        </Link>
        <CardActions>
        <IconButton onClick={copyShareText} size="large" edge="start" color="inherit" sx={{ mr: 2 }}
            ><ContentCopyIcon/></IconButton>
        <FormGroup>
                <FormControlLabel onChange={(e)=>{
                    if(e.target.checked){
                        if (!passkey){
                            fetchPass()
                        }
                        setHidePasskey(false)
                    }else{
                        setHidePasskey(true)
                    }
                }} control={<Switch />} label="Show Passkey" labelPlacement="start"/>
            </FormGroup>
        </CardActions>
    </Card>
    );
}
export default CatCard