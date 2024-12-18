import { Avatar, Button, Container, FormHelperText, TextField, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import useAxios from "../utils/axiosClient"
import PetsIcon from '@mui/icons-material/Pets';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import EditIcon from '@mui/icons-material/Edit';

const EditCat = ()=>{
    const {id} = useParams()
    const {getCat, updateCat} = useAxios()
    const [inputs,setInputs] = useState({
        "cat_name":"",
        "cat_passkey":"",
    })
    const [message,setMessage] = useState({
        "cat_name":[],
        "cat_passkey":[],
        "image":[],
        "detail":""
    })
    const fileInputRef = useRef()

    useEffect(()=>{
        // this is a private route so no passkey is required...
        // if the request fail, forbidden
        const fetchData = async()=>{
            const resp = await getCat(id)
            if (resp.status === 200){
                setInputs({...resp.data})
            }
            else if(resp.response){
                setMessage({...message, ...resp.response.data})
            }else{
                setMessage({...message,detail:resp.message})
            }
        }
        fetchData()
    },[])

    const customSubmit = async(e)=>{
        e.preventDefault()
        const form_data = new FormData(e.target)
        const resp = await updateCat(id,form_data)
        if (resp.status === 200){
            setMessage({...message,detail:"Cat was updated"})
        }
        else if (resp.response){
            setMessage({...message, ...resp.response.data})
        }else{
            setMessage({...message,detail:resp.message})
        }
    }
    const handleInput = (e)=>{
        setInputs({...inputs,[e.target.name]:e.target.value})
        setMessage({...message,[e.target.name]:[]})
    }
    const handleFile = (e)=>{
        if(e.target.files[0].size > 2097152){
            setMessage({...message,[e.target.name]:"File is too big!"});
            e.target.value=""
        }
        else{
            setInputs({...inputs, image:URL.createObjectURL(e.target.files[0])})
        }
    }
    
    return <Container component="main" maxWidth="xs">
        <Box sx={{
                marginTop: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
        <Avatar sx={{ m: 1, bgcolor: 'primary.light' , width: 100, height: 100 }}>
            <PetsIcon sx={{fontSize:40 , fill:"#3d0205"}}/>
        </Avatar>
        <Typography variant="h3">
            Edit Cat's Info
        </Typography>
        <Box component="form" onSubmit={customSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
                value={inputs.cat_name}
                margin="normal"
                required
                fullWidth
                id="cat_name"
                label="Cat's name"
                name="cat_name"
                autoFocus
                error={message.cat_name.length !== 0}
                helperText={message.cat_name[0]}
                onChange={handleInput}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="cat_passkey"
                label="Passkey"
                id="Passkey"
                error={message.cat_passkey.length !== 0}
                helperText={message.cat_passkey[0]}
            />
            <input
                accept="image/*"
                name="image"
                style={{ display: 'none' }}
                id="upload"
                type="file"
                ref={fileInputRef}
                onChange={handleFile}
                />
            <label htmlFor="upload">
                <Button sx={{bgcolor:"secondary.light"}} variant="contained" component="span" endIcon={<AddAPhotoIcon/>}>
                    Upload
                </Button>
            </label>
            {inputs.image&&<Box >
                <Typography variant="body1">
                    your image:
                </Typography>
                <img src={inputs.image} style={{maxWidth:"15vw", maxHeight:"15vh", display:"block",marginLeft: "auto",marginRight: "auto", marginBottom:"2vh"}} 
                    alt="something is wrong with your file.."/>
                <Button variant="outlined" sx={{bgcolor:"primary.light"}} onClick={()=>{fileInputRef.current.value = "" ;setInputs({...inputs,image:""})}}>
                    Clear
                </Button>
            </Box>}
            <FormHelperText>{message.image}</FormHelperText>
            <FormHelperText>{message.detail}</FormHelperText>
            <Button
                startIcon={<EditIcon/>}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Edit Cat
            </Button>
        </Box>
    </Box>
    </Container>
}

export default EditCat