import { Box, Link, Slide, Typography } from "@mui/material"
import { useContext } from "react"
import AuthContext from "../context/authContext"

const HomePage = ()=>{
    const {user} = useContext(AuthContext)
    return (
        <Box maxWidth={"60%"} justifySelf="center">

            <Slide timeout={1000} direction="left" in={true} mountOnEnter unmountOnExit>
                <Typography variant="h2">
                    Welcome {user?user.username:'to Catlogs!'}
                </Typography>
            </Slide>
            {user && <Slide timeout={1000} direction="left" in={true} mountOnEnter unmountOnExit>
                    <Typography variant="body1">
                        you can view your cats <Link href="#/user" color="secondary" underline="none">here!</Link> 
                    </Typography>
                </Slide>}
            <Slide timeout={1500} direction="right" in={true} mountOnEnter unmountOnExit>
                <Typography variant="h3">
                    what is this place?
                </Typography>
            </Slide>
            <Slide timeout={1900} direction="left" in={true} mountOnEnter unmountOnExit>
                <Typography variant="body1">
                    This is a website to keep track of your cat's feeding!
                    sometimes your feline friend asks everyone for food and ends up 
                    eating more then it should... this site is here to help you 
                    keep track of the pets meals!
                </Typography>
            </Slide>
            <Slide timeout={2100} direction="right" in={true} mountOnEnter unmountOnExit>
                <Typography variant="h3">
                    How it works?
                </Typography>
            </Slide>
            <Slide timeout={2250} direction="left" in={true} mountOnEnter unmountOnExit>
                <Typography variant="body1">
                    <b>Just one accout for all your cats</b> one person needs to sign up,
                    and create a cat instance, the rest are able to feed the cat with a link
                    provided by the owner, just enter the cat's id and passkey and your done!
                </Typography>
            </Slide>
            <Slide timeout={2500} direction="right" in={true} mountOnEnter unmountOnExit>
                <Typography variant="subtitle2">
                    Happy cat feeding!
                </Typography>
            </Slide>
            
        </Box>)
}

export default HomePage

