import { Avatar, Box, Button, Container, FormHelperText, TextField, Typography } from "@mui/material"
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add';
import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import useAxios from "../utils/axiosClient"

const AddCat = ()=>{
    const [message, setMessage] = useState({
        "cat_name":[],
        "cat_passkey":[],
        "detail":""
    })
    const fileInputRef = useRef()
    const [file,setFile] = useState("")
    const {addCat} = useAxios()
    const navigate= useNavigate()
    const handleInput =(e)=>{
        setMessage({...message,[e.target.name]:[]})
    }
    const customSubmit = async (e) =>{
        e.preventDefault()
        const form_data = new FormData(e.target)
        const resp = await addCat(form_data)
        if (resp.status ===201){
            navigate('../')
        }else if (resp.response && resp.response.status === 400){ // means bad inputs
            setMessage({...message,...resp.response.data})
        }
        else{// some other error
            setMessage({...message,detail:resp.message})
        }
    }
    const handleFile = (e)=>{
        if(e.target.files[0].size > 2097152){
            setMessage({...message,[e.target.name]:"File is too big!"});
            e.target.value=""
        }
        else{
            setFile(URL.createObjectURL(e.target.files[0]))
        }
    }
    
    return (
    <Container component="main" maxWidth="xs">
            <Box sx={{
                    marginTop: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
            <Avatar sx={{ m: 1, bgcolor: 'primary.light' , width: 100, height: 100 }}>
                <FavoriteIcon sx={{width:"80%", height:"80%" , fill:"#3d0205"}}/>
            </Avatar>
            <Typography variant="h3">
                Add a cat to the family
            </Typography>
            <Box component="form" onSubmit={customSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
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
                    onChange={handleInput}
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
                {file&&<Box >
                    <Typography variant="body1">
                        your image:
                    </Typography>
                    <img src={file} style={{maxWidth:"15vw", maxHeight:"15vh", display:"block",marginLeft: "auto",marginRight: "auto", marginBottom:"2vh"}} 
                        alt="something is wrong with your file.."/>
                    <Button variant="outlined" sx={{bgcolor:"primary.light"}} onClick={()=>{fileInputRef.current.value = "" ;setFile("")}}>
                        Clear
                    </Button>
                </Box>}
                <FormHelperText>{message.image}</FormHelperText>
                <FormHelperText>{message.detail}</FormHelperText>
                <Button
                    startIcon={<AddIcon/>}
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Add Cat
                </Button>
            </Box>
        </Box>
    </Container>)
}

export {AddCat,}