
import { useContext, useState } from "react"
import AuthContext from "../context/authContext"
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
import { FormControl, FormHelperText, FormLabel, Radio, RadioGroup } from "@mui/material";
import PetsIcon from '@mui/icons-material/Pets';


const CatFeed = (props)=>{
    const {logCat} = useAxios()
    const {passkeys} = useContext(AuthContext)
    const [message,setMessage] = useState({
        amount:[],
        comment:[],
        feed_time:[],
        detail:""
    })
  
    const handleInput= (e)=>{
        //setInputs({...inputs,[e.target.name]:e.target.value})
        setMessage({...message,[e.target.name]:"",detail:""})
    }
    const customSubmit = async(e)=>{
        e.preventDefault()
        const feed_data = new FormData(e.target)
        const resp = await logCat(props.cat_id,feed_data,passkeys[props.cat_id])
        if (resp.status === 201){
            setMessage({...message,detail:"Your feed has been recorded!"})
            props.addLog(resp.data)
        }else if (resp.response && resp.response.status === 400){
            setMessage({...message,...resp.response.data})
        }
        else{// probably some error
            setMessage({...message,detail:resp.message})
        }
    }
    return <Container display="inline" component="main" maxWidth="xs">
    <Box sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Feed Cat
          </Typography>
          
          <Box component="form" onSubmit={customSubmit} noValidate sx={{ mt: 1 }}>

          <TextField
                required
                onChange={handleInput}
                fullwidth
                id="datetime-local"
                label="Feed Time"
                name="feed_time"
                type="datetime-local"
                defaultValue={new Date().toISOString().replaceAll("/","-").replace(", ","T").slice(0,-8)}
                sx={{ width: 250, marginBottom:2 }}
                error={message.feed_time.length !== 0}
                helperText={message.feed_time[0]}
                InputLabelProps={{
                shrink: true,
                }}
            />
            <br/>
            <FormControl variant="standard" component="fieldset" error={message.amount.length !==0}>
            <FormLabel component="legend" >Amount Fed</FormLabel>
            <RadioGroup
                aria-label="amount"
                defaultValue="medium"
                name="amount"
                onChange={handleInput}
            >
                <FormControlLabel value="small" control={<Radio />} label="Small" />
                <FormControlLabel value="medium" control={<Radio />} label="Medium" />
                <FormControlLabel value="large" control={<Radio />} label="Large" />
            </RadioGroup>
            <FormHelperText>{message.amount[0]}</FormHelperText>
            </FormControl>
            <TextField
              margin="normal"
              fullWidth
              id="comment"
              label="Comment"
              name="comment"
              autoFocus
              multiline
              error={message.comment.length !== 0}
              helperText={message.comment[0]}
              onChange={handleInput}
            />
            <Typography>{message.detail}</Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              startIcon={<PetsIcon/>}
            >
              Log
            </Button>
          </Box>
    </Box>
    </Container>

}
export default CatFeed