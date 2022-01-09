import { Avatar, Button, Container,  TextField, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { useNavigate } from "react-router-dom"
import SearchIcon from '@mui/icons-material/Search';
import { useState } from "react";

const CatsMainPage =()=>{
    const navigate = useNavigate()
    const [idErr,setIdErr]=useState("")

    const customSubmit = (e)=>{
        e.preventDefault()
        console.dir(e.target)
        if (e.target.cat_id.value){
                    navigate(`/${e.target.cat_id.value}`)
        }else{
            setIdErr("this filed is required")
        }

    }
    return <Container component="main" maxWidth="xs">
        <Box sx={{
            marginTop: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
        <Avatar sx={{ m: 1, bgcolor: 'primary.light', width: 100, height: 100}}>
            <SearchIcon sx={{fontSize:40 ,  fill:"black" }} />
        </Avatar>
        <Typography component="h1" variant="body1">
            Have a cat you want to search?
        </Typography>
        <Box component="form" onSubmit={customSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
                margin="normal"
                required
                fullWidth
                id="cat_id"
                label="Cat ID"
                name="cat_id"
                onChange={()=>{setIdErr("")}}
                error={idErr}
                helperText={idErr}
                autoFocus
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Go!
            </Button>
            </Box>
        </Box>
        </Container>
}

export default CatsMainPage